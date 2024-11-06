// src/features/dashboard/Dashboard.jsx
import { useState } from 'react';
import { 
  Users, 
  Car, 
  TrendingUp, 
  Calendar,
  DollarSign,
  LineChart,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  // Mock data - replace with real data later
  const stats = [
    {
      label: 'Total Leads',
      value: '245',
      change: '+12.5%',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Active Inventory',
      value: '58',
      change: '-3.2%',
      icon: Car,
      color: 'green'
    },
    {
      label: 'Monthly Revenue',
      value: '$125,200',
      change: '+8.1%',
      icon: DollarSign,
      color: 'purple'
    },
    {
      label: 'Conversion Rate',
      value: '24.3%',
      change: '+2.4%',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentLeads = [
    {
      name: 'John Smith',
      vehicle: '2024 Toyota Camry',
      status: 'New Lead',
      time: '2 hours ago'
    },
    {
      name: 'Sarah Johnson',
      vehicle: '2023 Honda CR-V',
      status: 'In Progress',
      time: '4 hours ago'
    },
    // Add more mock data as needed
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
          <p className="text-gray-600">Here's what's happening with your dealership today.</p>
        </div>
        <div className="space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Download Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add New Lead
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-12 w-12 text-${stat.color}-500 bg-${stat.color}-100 p-2 rounded-lg`} />
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sales Overview</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          {/* Add chart component here */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <LineChart className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Chart coming soon...</span>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {recentLeads.map((lead, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.vehicle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {lead.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700">
            View All Leads →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold">Upcoming Tasks</h4>
              <p className="text-sm text-gray-500">5 tasks due today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold">Active Deals</h4>
              <p className="text-sm text-gray-500">12 deals in progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold">Follow-ups</h4>
              <p className="text-sm text-gray-500">8 pending follow-ups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;