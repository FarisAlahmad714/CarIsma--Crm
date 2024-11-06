import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Car, 
  Settings,
  ChevronDown,
  Building2,
  LineChart,
  Mail
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isAdminExpanded, setIsAdminExpanded] = useState(false);

  const mainNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Inventory', icon: Car, path: '/inventory' },
    { name: 'Analytics', icon: LineChart, path: '/analytics' }
  ];

  const adminNavItems = [
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Company', icon: Building2, path: '/admin/company' },
    { name: 'Invitations', icon: Mail, path: '/admin/invitations' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-2xl font-bold text-blue-600">Carisma</span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {mainNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Admin Section */}
        {(user?.role === 'superadmin' || user?.role === 'admin') && (
          <div className="mt-8">
            <div className="px-3 mb-2">
              <button
                onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3" />
                  Administration
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isAdminExpanded ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            
            {isAdminExpanded && (
              <nav className="space-y-1 px-3">
                {adminNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;