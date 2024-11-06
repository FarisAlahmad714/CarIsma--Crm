import { useAuth } from '../../hooks/useAuth';
import { Bell, Menu, Search, Settings } from 'lucide-react';
import NotificationBadge from '../shared/NotificationBadge'; // Changed from { NotificationBadge }
import { motion } from 'framer-motion';
const Header = ({ onMenuClick, isSidebarOpen }) => {
  const { user, notifications = [] } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-20">
      <div className={`flex items-center justify-between h-16 px-4 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </motion.button>

          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell className="h-6 w-6 text-gray-600" />
            {notifications.length > 0 && (
              <NotificationBadge count={notifications.length} />
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Settings className="h-6 w-6 text-gray-600" />
          </motion.button>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;