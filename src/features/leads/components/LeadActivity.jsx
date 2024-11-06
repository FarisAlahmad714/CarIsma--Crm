import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

const LeadActivity = ({ activities, onAddActivity }) => {
  const [newActivity, setNewActivity] = useState({
    type: 'note',
    content: '',
    scheduleDate: ''
  });

  const activityIcons = {
    note: MessageSquare,
    call: Phone,
    email: Mail,
    meeting: Calendar,
    status_change: Clock,
    system: AlertCircle
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'text-green-500';
      case 'email': return 'text-blue-500';
      case 'meeting': return 'text-purple-500';
      case 'status_change': return 'text-orange-500';
      case 'system': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddActivity({
      ...newActivity,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    setNewActivity({
      type: 'note',
      content: '',
      scheduleDate: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Activity Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <select
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
            </select>

            {newActivity.type === 'meeting' && (
              <input
                type="datetime-local"
                value={newActivity.scheduleDate}
                onChange={(e) => setNewActivity({ ...newActivity, scheduleDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <textarea
            value={newActivity.content}
            onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
            placeholder="Add activity details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Activity
          </button>
        </div>
      </form>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activityIcons[activity.type] || MessageSquare;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-4"
            >
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {activity.type === 'status_change' 
                          ? `Status changed to ${activity.content}`
                          : activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </p>
                      {activity.type !== 'status_change' && (
                        <p className="text-gray-600 mt-1">{activity.content}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  {activity.scheduleDate && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Scheduled for: {new Date(activity.scheduleDate).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadActivity;