import { motion, AnimatePresence } from 'framer-motion';
import LeadCard from './LeadCard';

const LeadList = ({ leads, searchQuery, filters, onEdit, onView }) => {
  const filterLeads = () => {
    return leads.filter(lead => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!lead.name.toLowerCase().includes(query) &&
            !lead.email.toLowerCase().includes(query) &&
            !lead.vehicle.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && lead.status.toLowerCase() !== filters.status) {
        return false;
      }

      // Assignment filter
      if (filters.assignedTo === 'unassigned' && lead.assignedTo) {
        return false;
      } else if (filters.assignedTo === 'me' && lead.assignedTo !== 'Current User') { // Replace with actual user check
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const leadDate = new Date(lead.lastContact);
        const today = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (leadDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            if (leadDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            if (leadDate < monthAgo) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  };

  const filteredLeads = filterLeads();

  return (
    <div className="space-y-4">
      {filteredLeads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No leads match your search' : 'No leads found'}
          </p>
          {searchQuery && (
            <p className="text-gray-400 mt-2">
              Try adjusting your search or filters
            </p>
          )}
        </motion.div>
      ) : (
        <AnimatePresence>
          {filteredLeads.map((lead) => (
            <motion.div
              key={lead.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LeadCard
                lead={lead}
                onEdit={onEdit}
                onView={onView}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default LeadList;