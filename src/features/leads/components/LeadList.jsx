// src/features/leads/components/LeadList.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import LeadCard from './LeadCard';

const LeadList = ({ leads, onEdit, onDelete, onView , view = 'list' }) => {
  const { user } = useAuth();

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No leads found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    {view === 'list' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr> {/* Remove onClick from here */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name/Contact
                </th>
                {/* ... other headers ... */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onView(lead)} // Add onClick here
                >
                  {/* ... rest of the row content ... */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when clicking buttons
                        onEdit(lead);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when clicking buttons
                          onDelete(lead.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {leads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => onView(lead)} // Add onClick here too
                className="cursor-pointer"
              >
                <LeadCard
                  lead={lead}
                  onEdit={(e) => {
                    e.stopPropagation();
                    onEdit(lead);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    onDelete(lead.id);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default LeadList;