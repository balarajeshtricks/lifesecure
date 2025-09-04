import React, { useState, useEffect } from 'react';
import { LogOut, Users, Calendar, FileText, TrendingUp, X, Search, Filter } from 'lucide-react';
import { Customer } from '../types/Customer';
import { getCustomers, updateCustomerStatus } from '../services/storageService';
import CustomerCard from './CustomerCard';
import AppointmentModal from './AppointmentModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const statuses = ['All', 'Registered', 'Appointment Scheduled', 'Meeting', 'Closure', 'Not Interested'];

  const statusColors = {
    'Registered': 'bg-blue-100 text-blue-800',
    'Appointment Scheduled': 'bg-yellow-100 text-yellow-800',
    'Meeting': 'bg-purple-100 text-purple-800',
    'Closure': 'bg-green-100 text-green-800',
    'Not Interested': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, selectedStatus, searchTerm]);

  const loadCustomers = () => {
    const customerData = getCustomers();
    setCustomers(customerData);
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(customer => customer.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm)
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleStatusChange = (customerId: string, newStatus: Customer['status']) => {
    if (newStatus === 'Appointment Scheduled') {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setShowAppointmentModal(true);
      }
    } else {
      updateCustomerStatus(customerId, newStatus);
      loadCustomers();
    }
  };

  const handleAppointmentScheduled = (appointmentDetails: { date: string; time: string; place: string }) => {
    if (selectedCustomer) {
      updateCustomerStatus(selectedCustomer.id, 'Appointment Scheduled', appointmentDetails);
      loadCustomers();
      setShowAppointmentModal(false);
      setSelectedCustomer(null);
    }
  };

  const getStatusCounts = () => {
    const counts: {[key: string]: number} = {};
    customers.forEach(customer => {
      counts[customer.status] = (counts[customer.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">LifeSecure Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-3xl font-bold text-gray-800">{statusCounts['Appointment Scheduled'] || 0}</p>
              </div>
              <Calendar className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closures</p>
                <p className="text-3xl font-bold text-gray-800">{statusCounts['Closure'] || 0}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-3xl font-bold text-gray-800">
                  {customers.filter(c => !['Closure', 'Not Interested'].includes(c.status)).length}
                </p>
              </div>
              <FileText className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-full lg:w-auto overflow-x-auto">
              <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                  {status !== 'All' && statusCounts[status] ? ` (${statusCounts[status]})` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Customer Management</h2>
            <p className="text-gray-600 mt-1">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} 
              {selectedStatus !== 'All' && ` with status: ${selectedStatus}`}
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No customers found</p>
                <p className="text-gray-400">
                  {selectedStatus !== 'All' 
                    ? `No customers with status: ${selectedStatus}`
                    : 'No customers have submitted the lead form yet'
                  }
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onStatusChange={handleStatusChange}
                  statusColors={statusColors}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && selectedCustomer && (
        <AppointmentModal
          customer={selectedCustomer}
          onSchedule={handleAppointmentScheduled}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;