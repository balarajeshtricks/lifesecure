import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholder values if environment variables are not set
const defaultUrl = supabaseUrl || 'https://placeholder.supabase.co';
const defaultKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(defaultUrl, defaultKey);

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          mobile: string;
          dob: string;
          status: 'Registered' | 'Appointment Scheduled' | 'Meeting' | 'Closure' | 'Not Interested';
          appointment_date: string | null;
          appointment_time: string | null;
          appointment_place: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          mobile: string;
          dob: string;
          status?: 'Registered' | 'Appointment Scheduled' | 'Meeting' | 'Closure' | 'Not Interested';
          appointment_date?: string | null;
          appointment_time?: string | null;
          appointment_place?: string | null;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          mobile?: string;
          dob?: string;
          status?: 'Registered' | 'Appointment Scheduled' | 'Meeting' | 'Closure' | 'Not Interested';
          appointment_date?: string | null;
          appointment_time?: string | null;
          appointment_place?: string | null;
          submitted_at?: string;
          updated_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
    };
  };
};