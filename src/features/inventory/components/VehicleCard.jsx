// src/features/inventory/components/VehicleCard.jsx
import { motion } from 'framer-motion';
import { Edit, Trash2, Car, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const { user } = useAuth();
  const hasAccess = user?.role === 'admin' || user?.role === 'superadmin';

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        {/* Header with Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.price)}</span>
          </div>
          <div className="text-sm text-gray-500">
            <p>VIN: {vehicle.vin}</p>
            <p>Mileage: {vehicle.mileage.toLocaleString()} miles</p>
            <p>{vehicle.transmission} • {vehicle.fuelType}</p>
          </div>
        </div>

        {/* Admin Actions */}
        {hasAccess && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VehicleCard;