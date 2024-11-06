import { motion } from 'framer-motion';
import { Phone, Mail, Car, Calendar } from 'lucide-react';
import LeadStatusBadge from './LeadStatusBadge';

const LeadCard = ({ lead, onEdit, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Car className="h-4 w-4 mr-2" />
              <span>{lead.vehicle}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last Contact: {new Date(lead.lastContact).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <LeadStatusBadge status={lead.status} />
          <div className="text-sm text-gray-500">
            Assigned to: {lead.assignedTo}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-600">{lead.notes}</p>
        <div className="space-x-2">
          <button 
            onClick={() => onEdit(lead)}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Edit
          </button>
          <button 
            onClick={() => onView(lead)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCard;