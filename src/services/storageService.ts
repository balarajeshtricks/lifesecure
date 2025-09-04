import { Customer, Admin } from '../types/Customer';

const CUSTOMERS_KEY = 'life-insurance-customers';
const ADMIN_KEY = 'life-insurance-admin';

// Initialize default admin if not exists
const initializeAdmin = () => {
  const existingAdmin = localStorage.getItem(ADMIN_KEY);
  if (!existingAdmin) {
    const defaultAdmin: Admin = {
      username: 'admin',
      password: 'admin123' // In production, this would be hashed
    };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(defaultAdmin));
  }
};

export const saveCustomer = (customer: Customer) => {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateCustomerStatus = (customerId: string, status: Customer['status'], appointmentDetails?: Customer['appointmentDetails']) => {
  const customers = getCustomers();
  const customerIndex = customers.findIndex(c => c.id === customerId);
  
  if (customerIndex !== -1) {
    customers[customerIndex].status = status;
    if (appointmentDetails) {
      customers[customerIndex].appointmentDetails = appointmentDetails;
    }
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }
};

export const authenticateAdmin = (username: string, password: string): boolean => {
  const adminData = localStorage.getItem(ADMIN_KEY);
  if (!adminData) return false;
  
  const admin: Admin = JSON.parse(adminData);
  return admin.username === username && admin.password === password;
};

// Initialize admin on module load
initializeAdmin();