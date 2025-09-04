export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  status: 'Registered' | 'Appointment Scheduled' | 'Meeting' | 'Closure' | 'Not Interested';
  appointment_date?: string | null;
  appointment_time?: string | null;
  appointment_place?: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}