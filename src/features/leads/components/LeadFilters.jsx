import { motion } from 'framer-motion';

const LeadFilters = ({ filters, onChange }) => {
  const statusOptions = [
    'All',
    'New',
    'In Progress',
    'Qualified',
    'Unqualified',
    'Completed'
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((status) => (
            <option key={status.toLowerCase()} value={status.toLowerCase()}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <select
          value={filters.dateRange}
          onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assigned To
        </label>
        <select
          value={filters.assignedTo}
          onChange={(e) => onChange({ ...filters, assignedTo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Team Members</option>
          <option value="me">Assigned to Me</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
    </motion.div>
  );
};

export default LeadFilters;