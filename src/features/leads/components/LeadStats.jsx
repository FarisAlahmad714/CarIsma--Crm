// src/features/leads/components/LeadStats.jsx
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

const LeadStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'New Leads',
      value: stats.new,
      icon: UserPlus,
      color: 'green'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      label: 'Qualified',
      value: stats.qualified,
      icon: UserCheck,
      color: 'purple'
    },
    {
      label: 'Converted',
      value: stats.converted,
      icon: CheckCircle,
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 border-${item.color}-500`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg bg-${item.color}-100`}>
              <item.icon className={`h-5 w-5 text-${item.color}-600`} />
            </div>
            <span className={`text-${item.color}-600 text-sm font-medium`}>
              {((stats.total ? (item.value / stats.total) * 100 : 0)).toFixed(1)}%
            </span>
          </div>
          <p className="mt-4 text-2xl font-semibold">{item.value}</p>
          <p className="text-gray-600 text-sm">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default LeadStats;