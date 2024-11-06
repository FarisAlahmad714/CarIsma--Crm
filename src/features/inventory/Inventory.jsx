import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Search, 
  SlidersHorizontal,
  Download,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import VehicleCard from './components/VehicleCard';
import VehicleForm from './components/VehicleForm';
import { useInventory } from './hooks/useInventory';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const Inventory = () => {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useInventory();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    make: 'all',
    year: 'all',
    priceRange: 'all'
  });
  const [sorting, setSorting] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

  const hasAccess = user?.role === 'admin' || user?.role === 'superadmin';

  const handleAddVehicle = async (vehicleData) => {
    try {
      await addVehicle({
        ...vehicleData,
        addedBy: user.id,
        company: user.company
      });
      setShowAddVehicle(false);
      addNotification('success', 'Vehicle added successfully');
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      addNotification('error', 'Failed to add vehicle');
    }
  };

  const handleEditVehicle = async (vehicleData) => {
    try {
      await updateVehicle(editingVehicle.id, {
        ...vehicleData,
        updatedBy: user.id,
        updatedAt: new Date().toISOString()
      });
      setEditingVehicle(null);
      addNotification('success', 'Vehicle updated successfully');
    } catch (err) {
      console.error('Failed to update vehicle:', err);
      addNotification('error', 'Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId);
        addNotification('success', 'Vehicle deleted successfully');
      } catch (err) {
        console.error('Failed to delete vehicle:', err);
        addNotification('error', 'Failed to delete vehicle');
      }
    }
  };

  const handleExportInventory = () => {
    // TODO: Implement export functionality
    addNotification('info', 'Export functionality coming soon');
  };

  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          vehicle.make,
          vehicle.model,
          vehicle.vin,
          vehicle.year?.toString(),
          vehicle.description
        ].map(field => field?.toLowerCase());
        
        if (!searchableFields.some(field => field?.includes(query))) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && vehicle.status !== filters.status) {
        return false;
      }

      // Make filter
      if (filters.make !== 'all' && vehicle.make !== filters.make) {
        return false;
      }

      // Year filter
      if (filters.year !== 'all' && vehicle.year.toString() !== filters.year) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = parseFloat(vehicle.price);
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (price < min || (max && price > max)) {
          return false;
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

  const filteredVehicles = getFilteredVehicles();
  const uniqueMakes = [...new Set(vehicles.map(v => v.make))];
  const uniqueYears = [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">
            {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportInventory}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          {hasAccess && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddVehicle(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vehicle</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by make, model, VIN, or year..."
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
              onClick={() => setSorting(prev => ({
                ...prev,
                direction: prev.direction === 'asc' ? 'desc' : 'asc'
              }))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${
                  sorting.direction === 'asc' ? 'rotate-180' : ''
                }`} 
              />
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
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Make Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Make</label>
                  <select
                    value={filters.make}
                    onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Makes</option>
                    {uniqueMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Years</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">Any Price</option>
                    <option value="0-10000">Under $10,000</option>
                    <option value="10000-20000">$10,000 - $20,000</option>
                    <option value="20000-30000">$20,000 - $30,000</option>
                    <option value="30000-50000">$30,000 - $50,000</option>
                    <option value="50000">Over $50,000</option>
                  </select>
                </div>
              </div>
              
              {/* Reset Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({
                    status: 'all',
                    make: 'all',
                    year: 'all',
                    priceRange: 'all'
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset Filters
                </button>
              </div>
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
            onClick={() => window.location.reload()}
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
        /* Vehicle Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={setEditingVehicle}
              onDelete={handleDeleteVehicle}
            />
          ))}
          
          {filteredVehicles.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery || Object.values(filters).some(v => v !== 'all')
                  ? 'No vehicles match your search criteria'
                  : 'No vehicles in inventory'}
              </p>
              {hasAccess && (
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Add your first vehicle
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Vehicle Modal */}
      <AnimatePresence>
        {(showAddVehicle || editingVehicle) && (
          <VehicleForm
            vehicle={editingVehicle}
            onClose={() => {
              setShowAddVehicle(false);
              setEditingVehicle(null);
            }}
            onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
