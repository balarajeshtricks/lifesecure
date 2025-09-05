import React, { useState } from 'react';
import { Customer, CustomerStatus } from '../types/Customer';
import { Calendar, Clock, MapPin, Phone, Mail, User, Edit3 } from 'lucide-react';
import { updateCustomerStatus } from '../services/customerService';

interface CustomerCardProps {
  customer: Customer;
  onStatusUpdate: (customerId: string, status: CustomerStatus, appointmentDetails?: {
    date: string;
    time: string;
    place: string;
  }) => void;
}

const statusColors = {
  registered: 'bg-blue-100 text-blue-800',
  'appointment-scheduled': 'bg-yellow-100 text-yellow-800',
  meeting: 'bg-purple-100 text-purple-800',
  closure: 'bg-green-100 text-green-800',
  'not-interested': 'bg-red-100 text-red-800'
};

const statusLabels = {
  registered: 'Registered',
  'appointment-scheduled': 'Appointment Scheduled',
  meeting: 'Meeting',
  closure: 'Closure',
  'not-interested': 'Not Interested'
};

export default function CustomerCard({ customer, onStatusUpdate }: CustomerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus>(customer.status);

  const handleStatusChange = async (newStatus: CustomerStatus) => {
    if (newStatus === 'appointment-scheduled') {
      // This will be handled by the parent component to show appointment modal
      onStatusUpdate(customer.id, newStatus);
    } else {
      try {
        await updateCustomerStatus(customer.id, newStatus);
        onStatusUpdate(customer.id, newStatus);
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">ID: {customer.id.slice(0, 8)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value as CustomerStatus)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onBlur={() => setIsEditing(false)}
            >
              <option value="registered">Registered</option>
              <option value="appointment-scheduled">Appointment Scheduled</option>
              <option value="meeting">Meeting</option>
              <option value="closure">Closure</option>
              <option value="not-interested">Not Interested</option>
            </select>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[customer.status]}`}>
                {statusLabels[customer.status]}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit status"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{customer.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{customer.mobile}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>DOB: {formatDate(customer.dob)}</span>
        </div>
        
        <div className="text-xs text-gray-500">
          Submitted: {formatDate(customer.createdAt)}
        </div>

        {customer.status === 'appointment-scheduled' && customer.appointmentDate && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Appointment Details</h4>
            <div className="space-y-1 text-sm text-yellow-700">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(customer.appointmentDate)}</span>
              </div>
              {customer.appointmentTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{customer.appointmentTime}</span>
                </div>
              )}
              {customer.appointmentPlace && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>{customer.appointmentPlace}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}