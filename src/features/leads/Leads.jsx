// src/features/leads/Leads.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Search, 
  Download,
  RefreshCw
} from 'lucide-react';
import { useInventory } from '../inventory/hooks/useInventory';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import LeadFilters from './components/LeadFilters';
import LeadStats from './components/LeadStats';
import { useLeads } from './hooks/useLeads';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationContext';
import LeadDetail from './components/LeadDetail';

const Leads = () => {
  const { user } = useAuth();
  const { vehicles } = useInventory();
  const { 
    leads, 
    loading, 
    error, 
    addLead, 
    updateLead, 
    deleteLead, 
    updateLeadStatus,
    refreshLeads,
  } = useLeads();
  const { addNotification } = useNotifications();
  const [viewingLead, setViewingLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'board'
  const [filters, setFilters] = useState({
    status: 'all',
    assignedTo: 'all',
    dateRange: 'all',
    priority: 'all'
  });
  const [sorting, setSorting] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

  // Stats calculations
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    inProgress: leads.filter(l => l.status === 'in_progress').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'completed').length,
  };

  const handleViewLead = (lead) => {
    setViewingLead(lead);
  };

  const handleAddLead = async (leadData) => {
    try {
      await addLead(leadData);
      setShowAddLead(false);
      addNotification('success', 'Lead created successfully');
    } catch (err) {
      console.error('Failed to add lead:', err);
      addNotification('error', 'Failed to create lead');
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      addNotification('success', `Lead status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update lead status:', err);
      addNotification('error', 'Failed to update lead status');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(leadId);
        addNotification('success', 'Lead deleted successfully');
      } catch (err) {
        console.error('Failed to delete lead:', err);
        addNotification('error', 'Failed to delete lead');
      }
    }
  };

  const handleEditLead = async (leadData) => {
    try {
      await updateLead(editingLead.id, {
        ...leadData,
        updatedBy: user.id,
        updatedAt: new Date().toISOString()
      });
      setEditingLead(null);
      addNotification('success', 'Lead updated successfully');
    } catch (err) {
      console.error('Failed to update lead:', err);
      addNotification('error', 'Failed to update lead');
    }
  };

  const handleExportLeads = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Vehicle', 'Status', 'Priority', 'Created At'];
    const rows = leads.map(lead => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.vehicle,
      lead.status,
      lead.priority,
      lead.createdAt
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\r\n';
    rows.forEach(rowArray => {
      const row = rowArray.join(',');
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredLeads = () => {
    return leads.filter(lead => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          lead.name,
          lead.email,
          lead.phone,
          lead.vehicle,
          lead.notes
        ].map(field => field?.toLowerCase());
        
        if (!searchableFields.some(field => field?.includes(query))) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && lead.status !== filters.status) {
        return false;
      }

      // Assignment filter
      if (filters.assignedTo === 'me' && lead.assignedTo !== user.id) {
        return false;
      } else if (filters.assignedTo === 'unassigned' && lead.assignedTo) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && lead.priority !== filters.priority) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const leadDate = new Date(lead.createdAt);
        const today = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            return leadDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            return leadDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            return leadDate >= monthAgo;
          default:
            return true;
        }
      }

      return true;
    }).sort((a, b) => {
      const aValue = a[sorting.field];
      const bValue = b[sorting.field];
      const direction = sorting.direction === 'asc' ? 1 : -1;
      
      return aValue < bValue ? -direction : direction;
    });
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">
            {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportLeads}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddLead(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Lead</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <LeadStats stats={stats} />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search leads by name, email, phone, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center space-x-2 ${
                showFilters 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {Object.values(filters).some(v => v !== 'all') && (
                <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  {Object.values(filters).filter(v => v !== 'all').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setView(view === 'list' ? 'board' : 'list')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {view === 'list' ? 'Board View' : 'List View'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LeadFilters 
                filters={filters} 
                onChange={setFilters}
                onReset={() => setFilters({
                  status: 'all',
                  assignedTo: 'all',
                  dateRange: 'all',
                  priority: 'all'
                })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center text-red-700">
            <span>{error}</span>
          </div>
          <button
            onClick={refreshLeads}
            className="flex items-center text-red-700 hover:text-red-800"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        /* Lead List */
        <LeadList
        leads={filteredLeads}
        view={view}
        onEdit={setEditingLead}
        onDelete={handleDeleteLead}
        onView={handleViewLead}
        />
      )}
 {/* Lead Detail Modal */}
 <AnimatePresence>
        {viewingLead && (
          <LeadDetail
            lead={viewingLead}
            onClose={() => setViewingLead(null)}
            onEdit={setEditingLead}
            onDelete={handleDeleteLead}
          />
        )}
      </AnimatePresence>
      {/* Add/Edit Lead Modal */}
      <AnimatePresence>
        {(showAddLead || editingLead) && (
          <LeadForm
            lead={editingLead}
            onSubmit={editingLead ? handleEditLead : handleAddLead}
            onClose={() => {
              setShowAddLead(false);
              setEditingLead(null);
            }}
            availableVehicles={vehicles}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leads;