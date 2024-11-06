// src/features/leads/components/LeadDetail.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Car,
  DollarSign,
  Clock,
  Edit
} from 'lucide-react';
import LeadStatus from './LeadStatus';
import LeadActivity from './LeadActivity';
import LeadForm from './LeadForm';

const LeadDetail = ({ lead, onClose, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'activity'

  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdate(lead.id, { 
        ...lead, 
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      
      // Add status change to activities
      await onUpdate(lead.id, {
        activities: [
          ...(lead.activities || []),
          {
            id: Date.now(),
            type: 'status_change',
            content: newStatus,
            timestamp: new Date().toISOString()
          }
        ]
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddActivity = async (activity) => {
    try {
      await onUpdate(lead.id, {
        activities: [
          ...(lead.activities || []),
          activity
        ]
      });
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {lead.name}
              </h2>
              <p className="text-sm text-gray-500">
                Added on {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEdit(true)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <LeadStatus
              currentStatus={lead.status}
              onStatusChange={handleStatusChange}
              disabledStatuses={
                lead.status === 'completed' ? ['new', 'contacted'] : []
              }
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{lead.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-700">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-700">
                        {lead.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Vehicle Interest */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vehicle Interest
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{lead.vehicle}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{lead.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{lead.timeframe}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <p className="mt-1 text-gray-600">
                        {lead.notes || 'No notes added'}
                      </p>
                    </div>
                    {lead.followUpDate && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span>
                          Follow-up scheduled for:{' '}
                          {new Date(lead.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <LeadActivity
                activities={lead.activities || []}
                onAddActivity={handleAddActivity}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <LeadForm
            lead={lead}
            onSubmit={async (updatedData) => {
              await onUpdate(lead.id, updatedData);
              setShowEdit(false);
            }}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadDetail;yes 