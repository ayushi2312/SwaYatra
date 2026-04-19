/**
 * Booking shape used by the UI (aligned with MySQL `bookings` + API mapper).
 */

export interface Booking {
  id: string;
  placeId: string;
  placeName: string;
  date: string;
  time: string;
  visitors: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  qrCode?: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

export function generateBookingId(): string {
  return `SWA-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
}
