import { supabase } from '../lib/supabase';
import { Customer } from '../types/Customer';

// Demo data for when Supabase is not connected
let demoCustomers: Customer[] = [];
let demoIdCounter = 1;

const isDemoMode = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co';
};

export const saveCustomer = async (customerData: Omit<Customer, 'id' | 'submitted_at' | 'updated_at'>) => {
  if (isDemoMode()) {
    const newCustomer: Customer = {
      ...customerData,
      id: `demo-${demoIdCounter++}`,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    demoCustomers.push(newCustomer);
    return newCustomer;
  }

  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();

  if (error) {
    console.error('Error saving customer:', error);
    throw new Error('Failed to save customer data');
  }

  return data;
};

export const getCustomers = async (): Promise<Customer[]> => {
  if (isDemoMode()) {
    return demoCustomers;
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }

  return data || [];
};

export const updateCustomerStatus = async (
  customerId: string, 
  status: Customer['status'], 
  appointmentDetails?: {
    date: string;
    time: string;
    place: string;
  }
) => {
  if (isDemoMode()) {
    const customerIndex = demoCustomers.findIndex(c => c.id === customerId);
    if (customerIndex !== -1) {
      const updatedCustomer = {
        ...demoCustomers[customerIndex],
        status,
        updated_at: new Date().toISOString()
      };
      
      if (appointmentDetails) {
        updatedCustomer.appointment_date = appointmentDetails.date;
        updatedCustomer.appointment_time = appointmentDetails.time;
        updatedCustomer.appointment_place = appointmentDetails.place;
      } else if (status !== 'Appointment Scheduled') {
        updatedCustomer.appointment_date = null;
        updatedCustomer.appointment_time = null;
        updatedCustomer.appointment_place = null;
      }
      
      demoCustomers[customerIndex] = updatedCustomer;
      return updatedCustomer;
    }
    throw new Error('Customer not found');
  }

  const updateData: any = { status };
  
  if (appointmentDetails) {
    updateData.appointment_date = appointmentDetails.date;
    updateData.appointment_time = appointmentDetails.time;
    updateData.appointment_place = appointmentDetails.place;
  } else if (status !== 'Appointment Scheduled') {
    // Clear appointment details if status is not appointment scheduled
    updateData.appointment_date = null;
    updateData.appointment_time = null;
    updateData.appointment_place = null;
  }

  const { data, error } = await supabase
    .from('customers')
    .update(updateData)
    .eq('id', customerId)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer status:', error);
    throw new Error('Failed to update customer status');
  }

  return data;
};

export const getCustomersByStatus = async (status: Customer['status']): Promise<Customer[]> => {
  if (isDemoMode()) {
    return demoCustomers.filter(customer => customer.status === status);
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('status', status)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers by status:', error);
    throw new Error('Failed to fetch customers');
  }

  return data || [];
};