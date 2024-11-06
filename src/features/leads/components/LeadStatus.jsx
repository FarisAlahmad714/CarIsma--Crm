// src/features/leads/components/LeadStatus.jsx
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  UserX 
} from 'lucide-react';

const LeadStatus = ({ currentStatus, onStatusChange, disabledStatuses = [] }) => {
  const statuses = [
    { 
      id: 'new', 
      label: 'New', 
      icon: Clock,
      color: 'blue',
      description: 'Lead just created'
    },
    { 
      id: 'contacted', 
      label: 'Contacted', 
      icon: AlertCircle,
      color: 'yellow',
      description: 'Initial contact made'
    },
    { 
      id: 'qualified', 
      label: 'Qualified', 
      icon: UserCheck,
      color: 'green',
      description: 'Lead meets criteria'
    },
    { 
      id: 'unqualified', 
      label: 'Unqualified', 
      icon: UserX,
      color: 'red',
      description: 'Lead doesn\'t meet criteria'
    },
    { 
      id: 'in_progress', 
      label: 'In Progress', 
      icon: Clock,
      color: 'purple',
      description: 'Deal in progress'
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: CheckCircle,
      color: 'emerald',
      description: 'Deal closed'
    }
  ];

  const getCurrentStep = () => {
    return statuses.findIndex(status => status.id === currentStatus);
  };

  return (
    <div className="w-full">
      {/* Status Steps */}
      <div className="relative">
        <div className="absolute top-5 w-full h-0.5 bg-gray-200"/>
        <div 
          className="absolute top-5 h-0.5 bg-blue-500 transition-all duration-500"
          style={{ 
            width: `${(getCurrentStep() / (statuses.length - 1)) * 100}%`,
          }}
        />
        
        <div className="relative flex justify-between">
          {statuses.map((status, index) => {
            const Icon = status.icon;
            const isActive = getCurrentStep() >= index;
            const isDisabled = disabledStatuses.includes(status.id);
            
            return (
              <div 
                key={status.id}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={!isDisabled ? { scale: 1.1 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  onClick={() => !isDisabled && onStatusChange(status.id)}
                  disabled={isDisabled}
                  className={`
                    relative z-10 rounded-full p-2 
                    ${isActive 
                      ? `bg-${status.color}-100 text-${status.color}-600` 
                      : 'bg-gray-100 text-gray-400'
                    }
                    ${isDisabled 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:shadow-lg'
                    }
                    transition-all duration-200
                  `}
                >
                  <Icon className="h-6 w-6" />
                </motion.button>
                
                <div className="mt-2 text-center">
                  <span className={`
                    text-sm font-medium
                    ${isActive ? `text-${status.color}-600` : 'text-gray-500'}
                  `}>
                    {status.label}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {status.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Actions */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Current Status: <span className="font-medium">{
            statuses.find(s => s.id === currentStatus)?.label
          }</span>
        </div>
        
        <div className="space-x-2">
          {getCurrentStep() > 0 && (
            <button
              onClick={() => onStatusChange(
                statuses[getCurrentStep() - 1].id
              )}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          {getCurrentStep() < statuses.length - 1 && (
            <button
              onClick={() => onStatusChange(
                statuses[getCurrentStep() + 1].id
              )}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadStatus;