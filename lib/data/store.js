import {
  INITIAL_SERVICES,
  INITIAL_TECHNICIANS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  INITIAL_WARRANTIES,
  INITIAL_RECEIPTS,
} from './demoData';
import { isValidTransition, BOOKING_STATES } from '../state-machine/bookingWorkflow';

// Server-side in-memory repository to power REST API routes when Supabase keys are pending
class MemoryDataStore {
  constructor() {
    this.services = [...INITIAL_SERVICES];
    this.technicians = [...INITIAL_TECHNICIANS];
    this.bookings = [...INITIAL_BOOKINGS];
    this.reviews = [...INITIAL_REVIEWS];
    this.complaints = [...INITIAL_COMPLAINTS];
    this.warranties = [...INITIAL_WARRANTIES];
    this.receipts = [...INITIAL_RECEIPTS];
  }

  // --- Services ---
  getServices({ category, search, activeOnly = false } = {}) {
    let result = [...this.services];
    if (activeOnly) {
      result = result.filter(s => s.is_active);
    }
    if (category && category !== 'All') {
      result = result.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || s.short_description.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getServiceById(id) {
    return this.services.find(s => s.id === id || s.slug === id) || null;
  }

  updateService(id, updates) {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.services[idx] = { ...this.services[idx], ...updates, updated_at: new Date().toISOString() };
    return this.services[idx];
  }

  createService(data) {
    const newService = {
      id: `s-${Date.now()}`,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      is_active: true,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.services.push(newService);
    return newService;
  }

  // --- Technicians ---
  getTechnicians({ category, status, isAvailable } = {}) {
    let result = [...this.technicians];
    if (category) {
      result = result.filter(t => t.service_categories.includes(category));
    }
    if (status) {
      result = result.filter(t => t.verification_status === status);
    }
    if (typeof isAvailable === 'boolean') {
      result = result.filter(t => t.is_available === isAvailable);
    }
    return result;
  }

  getTechnicianById(id) {
    return this.technicians.find(t => t.id === id || t.user_id === id) || null;
  }

  updateTechnician(id, updates) {
    const idx = this.technicians.findIndex(t => t.id === id || t.user_id === id);
    if (idx === -1) return null;
    this.technicians[idx] = { ...this.technicians[idx], ...updates, updated_at: new Date().toISOString() };
    return this.technicians[idx];
  }

  // --- Bookings ---
  getBookings({ customerId, technicianId, status } = {}) {
    let result = [...this.bookings];
    if (customerId) {
      result = result.filter(b => b.customer_id === customerId);
    }
    if (technicianId) {
      result = result.filter(b => b.assigned_technician_id === technicianId);
    }
    if (status) {
      result = result.filter(b => b.status === status);
    }
    // Sort descending by creation
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getBookingById(id) {
    return this.bookings.find(b => b.id === id || b.booking_code === id) || null;
  }

  createBooking(bookingData) {
    const bookingCode = `FXM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newBooking = {
      id: `bk-${Date.now()}`,
      booking_code: bookingCode,
      status: BOOKING_STATES.REQUESTED,
      payment_status: 'pending',
      payment_method: 'Cash / Online on Completion',
      created_at: now,
      updated_at: now,
      status_history: [
        {
          status: BOOKING_STATES.REQUESTED,
          timestamp: now,
          note: 'Booking request created by customer',
        },
      ],
      ...bookingData,
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  updateBookingStatus(id, newStatus, note, actorRole = 'system') {
    const booking = this.getBookingById(id);
    if (!booking) return { error: 'Booking not found', status: 404 };

    if (!isValidTransition(booking.status, newStatus)) {
      return {
        error: `Illegal state transition from "${booking.status}" to "${newStatus}"`,
        status: 400,
      };
    }

    const now = new Date().toISOString();
    booking.status = newStatus;
    booking.updated_at = now;

    if (!booking.status_history) {
      booking.status_history = [];
    }
    booking.status_history.push({
      status: newStatus,
      timestamp: now,
      note: note || `Status updated to ${newStatus} by ${actorRole}`,
    });

    return { booking };
  }

  dispatchTechnician(bookingId, technicianId) {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { error: 'Booking not found', status: 404 };

    const tech = this.getTechnicianById(technicianId);
    if (!tech) return { error: 'Technician not found', status: 404 };

    if (tech.verification_status !== 'verified') {
      return { error: 'Cannot assign an unverified technician', status: 400 };
    }

    const now = new Date().toISOString();
    booking.assigned_technician_id = tech.id;
    booking.technician_name = tech.full_name;
    booking.technician_phone = tech.phone;
    booking.technician_avatar = tech.avatar_url;
    booking.status = BOOKING_STATES.ASSIGNED;
    booking.updated_at = now;

    if (!booking.status_history) booking.status_history = [];
    booking.status_history.push({
      status: BOOKING_STATES.ASSIGNED,
      timestamp: now,
      note: `Dispatched technician ${tech.full_name} (${tech.service_categories.join(', ')})`,
    });

    return { booking };
  }

  recordServiceCompletion(bookingId, serviceRecord) {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { error: 'Booking not found', status: 404 };

    const now = new Date().toISOString();
    booking.service_record = {
      ...serviceRecord,
      completion_date: now,
    };
    booking.status = BOOKING_STATES.COMPLETED;
    booking.final_cost = (booking.estimated_cost || 50) + (serviceRecord.additional_charges || 0);
    booking.payment_status = 'paid';
    booking.updated_at = now;

    // Auto generate receipt
    const receiptNum = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const warrantyCode = `WRN-${(booking.service_category || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    booking.receipt_number = receiptNum;
    booking.warranty_code = warrantyCode;

    if (!booking.status_history) booking.status_history = [];
    booking.status_history.push({
      status: BOOKING_STATES.COMPLETED,
      timestamp: now,
      note: 'Technician finalized repair and registered service record',
    });

    // Add to warranties
    const warrantyMonths = serviceRecord.warranty_months || 3;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);

    const warrantyObj = {
      id: `wrn-${Date.now()}`,
      warranty_code: warrantyCode,
      booking_id: booking.id,
      booking_code: booking.booking_code,
      customer_name: booking.customer_name,
      service_name: booking.service_name,
      technician_name: booking.technician_name,
      warranty_months: warrantyMonths,
      start_date: now.split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      status: 'active',
      terms: 'FixMate standard warranty covering parts installed and labor precision.',
      created_at: now,
    };
    this.warranties.unshift(warrantyObj);

    // Add to receipts
    const receiptObj = {
      id: `rcp-${Date.now()}`,
      receipt_number: receiptNum,
      booking_id: booking.id,
      booking_code: booking.booking_code,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      technician_name: booking.technician_name,
      service_name: booking.service_name,
      base_price: 50.00,
      labor_charge: serviceRecord.labor_charges || 40.00,
      parts_cost: (serviceRecord.parts_used || []).reduce((sum, p) => sum + (p.cost || 0), 0),
      additional_charges: serviceRecord.additional_charges || 0.00,
      emergency_fee: booking.is_emergency ? 25.00 : 0.00,
      discount: 0.00,
      total_amount: booking.final_cost,
      payment_status: 'paid',
      payment_method: 'Credit Card / Online on Completion',
      payment_date: now,
      warranty_code: warrantyCode,
      warranty_duration: `${warrantyMonths} Months Warranty`,
    };
    this.receipts.unshift(receiptObj);

    return { booking, receipt: receiptObj, warranty: warrantyObj };
  }

  // --- Reviews ---
  getReviews({ technicianId, customerId } = {}) {
    let result = [...this.reviews];
    if (technicianId) result = result.filter(r => r.technician_id === technicianId);
    if (customerId) result = result.filter(r => r.customer_id === customerId);
    return result;
  }

  createReview(reviewData) {
    const newRev = {
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...reviewData,
    };
    this.reviews.unshift(newRev);

    // Update technician rating average
    if (reviewData.technician_id) {
      const tech = this.getTechnicianById(reviewData.technician_id);
      if (tech) {
        const count = (tech.rating_count || 0) + 1;
        const currentSum = (tech.rating || 5) * (tech.rating_count || 1);
        tech.rating = Number(((currentSum + reviewData.rating) / count).toFixed(2));
        tech.rating_count = count;
      }
    }

    return newRev;
  }

  // --- Complaints ---
  getComplaints({ customerId, status } = {}) {
    let result = [...this.complaints];
    if (customerId) result = result.filter(c => c.customer_id === customerId);
    if (status) result = result.filter(c => c.status === status);
    return result;
  }

  createComplaint(complaintData) {
    const newComplaint = {
      id: `cmp-${Date.now()}`,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...complaintData,
    };
    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  updateComplaint(id, updates) {
    const idx = this.complaints.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.complaints[idx] = {
      ...this.complaints[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.complaints[idx];
  }

  // --- Warranties ---
  getWarranties({ customerName, bookingId } = {}) {
    let result = [...this.warranties];
    if (customerName) result = result.filter(w => w.customer_name === customerName);
    if (bookingId) result = result.filter(w => w.booking_id === bookingId);
    return result;
  }

  // --- Receipts ---
  getReceiptByBookingId(bookingId) {
    return this.receipts.find(r => r.booking_id === bookingId || r.receipt_number === bookingId) || null;
  }

  // --- Aggregated Stats ---
  getStats() {
    const totalBookings = this.bookings.length;
    const activeJobs = this.bookings.filter(b =>
      ['technician_assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)
    ).length;
    const completedJobs = this.bookings.filter(b => b.status === 'completed').length;
    const pendingBookings = this.bookings.filter(b =>
      ['booking_requested', 'booking_confirmed'].includes(b.status)
    ).length;
    const totalCustomers = 48; // Aggregate base count
    const totalTechnicians = this.technicians.length;
    const verifiedTechnicians = this.technicians.filter(t => t.verification_status === 'verified').length;
    const pendingVerifications = this.technicians.filter(t => t.verification_status === 'pending').length;
    const pendingComplaints = this.complaints.filter(c => c.status !== 'resolved' && c.status !== 'rejected').length;

    // Calculate revenue
    const totalRevenue = this.bookings
      .filter(b => b.payment_status === 'paid' && b.final_cost)
      .reduce((sum, b) => sum + (b.final_cost || 0), 12540.00);

    return {
      totalBookings,
      activeJobs,
      completedJobs,
      pendingBookings,
      totalCustomers,
      totalTechnicians,
      verifiedTechnicians,
      pendingVerifications,
      pendingComplaints,
      totalRevenue,
    };
  }
}

// Global singleton instance on server across hot reloads
const globalForStore = global;
if (!globalForStore.memoryStore) {
  globalForStore.memoryStore = new MemoryDataStore();
}

export const store = globalForStore.memoryStore;
