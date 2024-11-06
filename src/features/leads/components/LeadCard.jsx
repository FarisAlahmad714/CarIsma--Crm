// src/features/leads/components/LeadCard.jsx
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { Phone, Mail, Calendar, Car } from 'lucide-react';

const LeadCard = ({ lead, onEdit, onDelete }) => {
  const { user } = useAuth();
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'superadmin';

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'unqualified': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="text-sm">{lead.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">{lead.phone}</span>
          </div>
          {lead.vehicle && (
            <div className="flex items-center text-gray-600">
              <Car className="h-4 w-4 mr-2" />
              <span className="text-sm">{lead.vehicle}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Updated {new Date(lead.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(lead)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            Edit
          </button>
          {hasAdminAccess && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this lead?')) {
                  onDelete(lead.id);
                }
              }}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCard;