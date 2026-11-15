/**
 * FixMate Job Booking State Machine
 * Implements strict state transitions, status sequence, labels, colors, and validators.
 */

export const BOOKING_STATES = {
  REQUESTED: 'booking_requested',
  CONFIRMED: 'booking_confirmed',
  ASSIGNED: 'technician_assigned',
  ON_THE_WAY: 'on_the_way',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

// Formal 8-step chronological sequence for real-time service tracking
export const WORKFLOW_STEPS = [
  {
    step: 1,
    status: BOOKING_STATES.REQUESTED,
    label: 'Booking Requested',
    shortLabel: 'Requested',
    description: 'Booking request placed and pending confirmation',
    icon: 'FileText',
  },
  {
    step: 2,
    status: BOOKING_STATES.CONFIRMED,
    label: 'Booking Confirmed',
    shortLabel: 'Confirmed',
    description: 'Service request reviewed and accepted into queue',
    icon: 'CheckCircle2',
  },
  {
    step: 3,
    status: BOOKING_STATES.ASSIGNED,
    label: 'Technician Assigned',
    shortLabel: 'Assigned',
    description: 'Verified professional technician assigned to your booking',
    icon: 'UserCheck',
  },
  {
    step: 4,
    status: BOOKING_STATES.ON_THE_WAY,
    label: 'Technician On the Way',
    shortLabel: 'On the Way',
    description: 'Technician is en route to your service location',
    icon: 'Truck',
  },
  {
    step: 5,
    status: BOOKING_STATES.ARRIVED,
    label: 'Technician Arrived',
    shortLabel: 'Arrived',
    description: 'Technician has reached your location and began inspection',
    icon: 'MapPin',
  },
  {
    step: 6,
    status: BOOKING_STATES.IN_PROGRESS,
    label: 'Repair In Progress',
    shortLabel: 'In Progress',
    description: 'Diagnosis completed, active repair and maintenance underway',
    icon: 'Wrench',
  },
  {
    step: 7,
    status: BOOKING_STATES.COMPLETED,
    label: 'Repair Completed',
    shortLabel: 'Completed',
    description: 'Service completed, parts and labor recorded, receipt generated',
    icon: 'Award',
  },
];

// Valid state transitions graph
export const ALLOWED_TRANSITIONS = {
  [BOOKING_STATES.REQUESTED]: [
    BOOKING_STATES.CONFIRMED,
    BOOKING_STATES.CANCELLED,
    BOOKING_STATES.REJECTED,
  ],
  [BOOKING_STATES.CONFIRMED]: [
    BOOKING_STATES.ASSIGNED,
    BOOKING_STATES.CANCELLED,
  ],
  [BOOKING_STATES.ASSIGNED]: [
    BOOKING_STATES.ON_THE_WAY,
    BOOKING_STATES.REJECTED,
    BOOKING_STATES.CANCELLED,
  ],
  [BOOKING_STATES.ON_THE_WAY]: [
    BOOKING_STATES.ARRIVED,
  ],
  [BOOKING_STATES.ARRIVED]: [
    BOOKING_STATES.IN_PROGRESS,
  ],
  [BOOKING_STATES.IN_PROGRESS]: [
    BOOKING_STATES.COMPLETED,
  ],
  [BOOKING_STATES.COMPLETED]: [], // Terminal state
  [BOOKING_STATES.CANCELLED]: [], // Terminal state
  [BOOKING_STATES.REJECTED]: [],  // Terminal state
};

/**
 * Validates if transition from currentStatus to nextStatus is legal
 * @param {string} currentStatus 
 * @param {string} nextStatus 
 * @returns {boolean}
 */
export function isValidTransition(currentStatus, nextStatus) {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true; // Idempotent
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

/**
 * Gets index of status in 1-based workflow sequence
 */
export function getStepNumber(status) {
  const index = WORKFLOW_STEPS.findIndex(s => s.status === status);
  return index !== -1 ? index + 1 : 0;
}

/**
 * Metadata helper for badges, colors, and human-friendly labels
 */
export function getStatusMeta(status) {
  switch (status) {
    case BOOKING_STATES.REQUESTED:
      return {
        label: 'Booking Requested',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        dotClass: 'bg-amber-500',
        description: 'Waiting for verification',
      };
    case BOOKING_STATES.CONFIRMED:
      return {
        label: 'Booking Confirmed',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        dotClass: 'bg-blue-500',
        description: 'Confirmed in system',
      };
    case BOOKING_STATES.ASSIGNED:
      return {
        label: 'Technician Assigned',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        dotClass: 'bg-indigo-500',
        description: 'Technician dispatched',
      };
    case BOOKING_STATES.ON_THE_WAY:
      return {
        label: 'On the Way',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        dotClass: 'bg-sky-500',
        description: 'En route to location',
      };
    case BOOKING_STATES.ARRIVED:
      return {
        label: 'Arrived at Site',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
        dotClass: 'bg-purple-500',
        description: 'Technician on premises',
      };
    case BOOKING_STATES.IN_PROGRESS:
      return {
        label: 'Repair In Progress',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
        dotClass: 'bg-orange-500',
        description: 'Active work happening',
      };
    case BOOKING_STATES.COMPLETED:
      return {
        label: 'Repair Completed',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dotClass: 'bg-emerald-500',
        description: 'Work done & verified',
      };
    case BOOKING_STATES.CANCELLED:
      return {
        label: 'Cancelled',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        dotClass: 'bg-rose-500',
        description: 'Booking was cancelled',
      };
    case BOOKING_STATES.REJECTED:
      return {
        label: 'Rejected',
        badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
        dotClass: 'bg-gray-500',
        description: 'Request declined',
      };
    default:
      return {
        label: status || 'Unknown',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-300',
        dotClass: 'bg-gray-400',
        description: '',
      };
  }
}
