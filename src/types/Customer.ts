export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  status: 'Registered' | 'Appointment Scheduled' | 'Meeting' | 'Closure' | 'Not Interested';
  submittedAt: string;
  appointmentDetails?: {
    date: string;
    time: string;
    place: string;
  };
}

export interface Admin {
  username: string;
  password: string;
}