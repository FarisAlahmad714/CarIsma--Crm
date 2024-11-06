// src/features/inventory/components/VehicleForm.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';

const VehicleForm = ({ vehicle, onSubmit, onClose }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const hasAccess = user?.role === 'admin' || user?.role === 'superadmin';
  
  // Redirect non-admin/non-superadmin users
  if (!hasAccess) {
    addNotification('error', 'Only administrators can modify inventory');
    onClose();
    return null;
  }

  const [formData, setFormData] = useState(vehicle || {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    vin: '',
    mileage: '',
    exteriorColor: '',
    interiorColor: '',
    transmission: 'automatic',
    fuelType: 'gasoline',
    bodyStyle: '',
    features: [],
    description: '',
    images: [],
    status: 'available'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.vin) newErrors.vin = 'VIN is required';
    
    // Basic VIN validation
    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be 17 characters';
    }

    // Price validation
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = 'Price must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      addNotification('success', vehicle ? 'Vehicle updated successfully' : 'Vehicle added successfully');
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      addNotification('error', 'Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Make *
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.make ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.make && (
                  <p className="mt-1 text-sm text-red-500">{errors.make}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-500">{errors.model}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-500">{errors.year}</p>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VIN *
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                  maxLength={17}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.vin ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.vin && (
                  <p className="mt-1 text-sm text-red-500">{errors.vin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mileage
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exterior Color
                </label>
                <input
                  type="text"
                  name="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={(e) => setFormData({ ...formData, exteriorColor: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interior Color
                </label>
                <input
                  type="text"
                  name="interiorColor"
                  value={formData.interiorColor}
                  onChange={(e) => setFormData({ ...formData, interiorColor: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

           {/* Form Actions */}
           <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>{vehicle ? 'Update Vehicle' : 'Add Vehicle'}</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleForm;