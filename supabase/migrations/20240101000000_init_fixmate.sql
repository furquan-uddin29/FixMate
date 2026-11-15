-- FixMate Database Schema Migration
-- CSE 3292 Web Development Bootcamp
-- Schema: Supabase PostgreSQL with RLS, Constraints, and State Tracking

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'technician', 'admin')),
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    estimated_duration TEXT NOT NULL DEFAULT '1 - 2 hours',
    icon TEXT DEFAULT 'Wrench',
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Technician Profiles Table
CREATE TABLE IF NOT EXISTS public.technician_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INTEGER NOT NULL DEFAULT 1,
    service_categories TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    rating_count INTEGER NOT NULL DEFAULT 0,
    completed_jobs_count INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    service_areas TEXT[] NOT NULL DEFAULT '{}',
    address TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Technician Verifications Table
CREATE TABLE IF NOT EXISTS public.technician_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    id_document_url TEXT,
    certificate_url TEXT,
    remarks TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- 6. Technician Availability Table
CREATE TABLE IF NOT EXISTS public.technician_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    day_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_time TIME NOT NULL DEFAULT '08:00:00',
    end_time TIME NOT NULL DEFAULT '18:00:00',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Pricing Table (Rate cards & tier pricing)
CREATE TABLE IF NOT EXISTS public.pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    base_price NUMERIC(10, 2) NOT NULL,
    labor_charge NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
    emergency_fee NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    additional_fee_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bookings Table (Core entity)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    service_id UUID NOT NULL REFERENCES public.services(id),
    assigned_technician_id UUID REFERENCES public.technician_profiles(id),
    status TEXT NOT NULL CHECK (status IN (
        'booking_requested',
        'booking_confirmed',
        'technician_assigned',
        'on_the_way',
        'arrived',
        'in_progress',
        'completed',
        'cancelled',
        'rejected'
    )) DEFAULT 'booking_requested',
    problem_title TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_address TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    special_instructions TEXT,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    final_cost NUMERIC(10, 2),
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    payment_method TEXT DEFAULT 'Cash / Online on Completion',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Booking Images Table
CREATE TABLE IF NOT EXISTS public.booking_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Booking Status History Table (Audit Trail & State Machine Logs)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Technician Assignments Table
CREATE TABLE IF NOT EXISTS public.technician_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('assigned', 'accepted', 'rejected', 'reassigned')) DEFAULT 'assigned',
    notes TEXT
);

-- 12. Service Records Table (Technician job completion details)
CREATE TABLE IF NOT EXISTS public.service_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id),
    repair_description TEXT NOT NULL,
    parts_used JSONB DEFAULT '[]'::jsonb,
    labor_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    additional_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    warranty_months INTEGER NOT NULL DEFAULT 3,
    completion_date TIMESTAMPTZ DEFAULT NOW(),
    technician_signature_notes TEXT
);

-- 13. Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Customer Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    category TEXT NOT NULL CHECK (category IN ('quality', 'delay', 'overcharging', 'behavior', 'damage', 'other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('submitted', 'under_review', 'in_progress', 'resolved', 'rejected')) DEFAULT 'submitted',
    image_urls TEXT[] DEFAULT '{}',
    admin_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Complaint Responses Table
CREATE TABLE IF NOT EXISTS public.complaint_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES public.profiles(id),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Warranties Table
CREATE TABLE IF NOT EXISTS public.warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id),
    service_id UUID NOT NULL REFERENCES public.services(id),
    warranty_code TEXT NOT NULL UNIQUE,
    warranty_months INTEGER NOT NULL DEFAULT 3,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'claimed', 'voided')) DEFAULT 'active',
    terms TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number TEXT NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    technician_name TEXT NOT NULL,
    service_name TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    labor_charge NUMERIC(10, 2) NOT NULL,
    additional_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    emergency_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'paid',
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    warranty_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('booking', 'status_change', 'assignment', 'verification', 'complaint', 'general')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_technician_id ON public.bookings(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_status_history_booking_id ON public.booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_technician_verifications_status ON public.technician_verifications(status);
CREATE INDEX IF NOT EXISTS idx_complaints_customer_id ON public.complaints(customer_id);
CREATE INDEX IF NOT EXISTS idx_warranties_booking_id ON public.warranties(booking_id);
CREATE INDEX IF NOT EXISTS idx_receipts_booking_id ON public.receipts(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Services & Pricing: Public Read
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Pricing is viewable by everyone" ON public.pricing FOR SELECT USING (true);

-- Technician Profiles: Public Read
CREATE POLICY "Technician profiles are viewable by everyone" ON public.technician_profiles FOR SELECT USING (true);
CREATE POLICY "Technicians can update own profile" ON public.technician_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Bookings: Customers can read own; Assigned Technicians can read assigned; Admin can read all
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (
    auth.uid() = customer_id OR 
    EXISTS (SELECT 1 FROM public.technician_profiles tp WHERE tp.id = bookings.assigned_technician_id AND tp.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (
    auth.uid() = customer_id
);

CREATE POLICY "Users and assigned technicians can update bookings" ON public.bookings FOR UPDATE USING (
    auth.uid() = customer_id OR
    EXISTS (SELECT 1 FROM public.technician_profiles tp WHERE tp.id = bookings.assigned_technician_id AND tp.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ==============================================================================
-- DATABASE TRIGGER: AUTO RECORD STATUS HISTORY ON BOOKING STATUS CHANGE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.booking_status_history (booking_id, status, note, changed_by)
        VALUES (NEW.id, NEW.status, 'Status updated to ' || NEW.status, auth.uid());
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_booking_status_history
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.handle_booking_status_change();
