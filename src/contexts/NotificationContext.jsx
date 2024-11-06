// src/contexts/NotificationContext.jsx
import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [
      ...prev,
      { id, type, message, createdAt: new Date() }
    ]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification,
        removeNotification
      }}
    >
      {children}
      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              flex items-center p-4 rounded-lg shadow-lg w-80
              ${notification.type === 'success' ? 'bg-green-50 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'}
            `}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-3" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-3" />
            ) : (
              <Info className="h-5 w-5 mr-3" />
            )}
            
            <p className="flex-1">{notification.message}</p>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};