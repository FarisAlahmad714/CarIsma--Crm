// src/features/inventory/Inventory.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Search, 
  SlidersHorizontal,
  Download,
  RefreshCw
} from 'lucide-react';
import { useInventory } from './hooks/useInventory';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import VehicleForm from './components/VehicleForm';

const Inventory = () => {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useInventory();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    year: 'all'
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
        console.error('Failed to delete vehicle:', errd);
        addNotification('error', 'Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">
            {vehicles.length} total vehicles
          </p>
        </div>
        {hasAccess && (
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddVehicle(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vehicle</span>
            </motion.button>
          </div>
        )}
      </div>
        <AnimatePresence>
        {(showAddVehicle || editingVehicle) && (
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
            onClose={() => {
              setShowAddVehicle(false);
              setEditingVehicle(null);
            }}
          />
        )}
      </AnimatePresence>
      {/* Rest of the component... */}
    </div>
    
  );
};

export default Inventory;