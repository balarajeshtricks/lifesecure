import React, { useState } from 'react';
import { ChevronDown, Calendar, Clock, MapPin, User, Mail, Phone, Cake } from 'lucide-react';
import { Customer } from '../types/Customer';

interface CustomerCardProps {
  customer: Customer;
  onStatusChange: (customerId: string, newStatus: Customer['status']) => void;
  statusColors: {[key: string]: string};
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onStatusChange, statusColors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statuses: Customer['status'][] = ['Registered', 'Appointment Scheduled', 'Meeting', 'Closure', 'Not Interested'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{customer.mobile}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${statusColors[customer.status]} transition-all hover:shadow-md`}
            >
              <span>{customer.status}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-48">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(customer.id, status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      status === customer.status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Customer Details</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Cake className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-gray-600">Age: </span>
                    <span className="font-medium text-gray-800">{calculateAge(customer.dob)} years</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-gray-600">DOB: </span>
                    <span className="font-medium text-gray-800">{new Date(customer.dob).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-gray-600">Submitted: </span>
                    <span className="font-medium text-gray-800">{formatDate(customer.submittedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {customer.appointmentDetails && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Appointment Details</h4>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-gray-800">{customer.appointmentDetails.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-gray-800">{customer.appointmentDetails.time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-gray-800">{customer.appointmentDetails.place}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showStatusDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowStatusDropdown(false)}
        />
      )}
    </div>
  );
};

export default CustomerCard;