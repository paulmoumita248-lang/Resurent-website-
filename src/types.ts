export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  createdAt: any;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected';

export interface Booking {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  guests: number;
  areaId: string;
  areaName: string;
  status: BookingStatus;
  notes?: string;
  isArchived?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface SeatingArea {
  id: string;
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  order: number;
}
