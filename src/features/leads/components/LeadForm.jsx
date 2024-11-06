import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  AlertCircle, 
  DollarSign // Ensure DollarSign is imported
} from 'lucide-react';
import PropTypes from 'prop-types';


const LeadForm = ({ lead = null, onSubmit, onClose, availableVehicles = [] }) => {
  const [formData, setFormData] = useState(lead || {
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    vehicle: '',
    vehicleNotAvailable: '', // New field for manual vehicle entry
    budget: '',
    timeframe: 'not_specified',
    source: '',
    status: 'new',
    priority: 'medium',
    assignedTo: '',
    followUpDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // ['basic', 'vehicle', 'details']

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'vehicle', label: 'Vehicle Interest' },
    { id: 'details', label: 'Additional Details' }
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'phone', label: 'Phone Inquiry' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'other', label: 'Other' }
  ];

  const timeframeOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: '3_months', label: 'Within 3 Months' },
    { value: '6_months', label: 'Within 6 Months' },
    { value: 'not_specified', label: 'Not Specified' }
  ];

  // In LeadForm.jsx - In the validateForm function
const validateForm = () => {
    const newErrors = {};
    console.log('Running validation on:', formData); // Add this
  
    // Basic Info Validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
  
    console.log('Validation errors:', newErrors); // Add this
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In LeadForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  // If not on the last tab, just move to next tab
  if (activeTab !== 'details') {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    setActiveTab(tabs[currentIndex + 1].id);
    return;
  }

  // Only validate and submit on the last tab
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  try {
    const submissionData = {
      ...formData,
      budget: formData.budget.replace(/[^0-9.]/g, ''),
      vehicle: formData.vehicle === 'not_available' 
        ? formData.vehicleNotAvailable.trim()
        : formData.vehicle
    };
    
    await onSubmit(submissionData);
    onClose();
  } catch (error) {
    console.error('Form submission error:', error);
    setErrors({ submit: error.message });
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
              {lead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Contact Method
                      </label>
                      <select
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="text">Text Message</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Interest Tab */}
              {activeTab === 'vehicle' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Interested Vehicle
                      </label>
                      <select
  name="vehicle"
  value={formData.vehicle}
  onChange={handleChange}
  className={`mt-1 block w-full px-3 py-2 border ${
    errors.vehicle ? 'border-red-500' : 'border-gray-300'
  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
>
  <option value="">Select Vehicle</option>
  
  {Array.isArray(availableVehicles) && availableVehicles.length > 0 ? (
    availableVehicles.map((vehicle) => (
      <option key={vehicle.id} value={vehicle.model}>
        {vehicle.make} {vehicle.model} ({vehicle.year})
      </option>
    ))
  ) : (
    <option value="" disabled>
      No vehicles available
    </option>
  )}
  
  <option value="not_available">Not Available</option>
</select>

                      {errors.vehicle && (
                        <p className="mt-1 text-sm text-red-500">{errors.vehicle}</p>
                      )}
                    </div>

                    {/* Vehicle Not Available Input */}
                    {formData.vehicle === 'not_available' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Vehicle of Interest (Not Available) *
                        </label>
                        <input
                          type="text"
                          name="vehicleNotAvailable"
                          value={formData.vehicleNotAvailable}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.vehicleNotAvailable ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="e.g., 2025 Tesla Model S"
                        />
                        {errors.vehicleNotAvailable && (
                          <p className="mt-1 text-sm text-red-500">{errors.vehicleNotAvailable}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget Range
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className={`mt-1 block w-full pl-10 pr-4 py-2 border ${
                            errors.budget ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="e.g., 30,000"
                        />
                      </div>
                      {errors.budget && (
                        <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Purchase Timeframe
                      </label>
                      <select
                        name="timeframe"
                        value={formData.timeframe}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {timeframeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Lead Source
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Source</option>
                        {sourceOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="unqualified">Unqualified</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        name="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assigned To
                      </label>
                      <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Team Member</option>
                        <option value="current_user">Myself</option>
                        {/* Add more team members dynamically */}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add any additional notes about this lead..."
                    />
                  </div>
                </div>
              )}

              {/* Form Error Message */}
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
  <div className="flex items-center space-x-2">
    <span className="text-sm text-gray-500">
      {activeTab === 'basic' ? '1' : activeTab === 'vehicle' ? '2' : '3'} of 3
    </span>
    <div className="flex space-x-1">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`h-2 w-8 rounded-full ${
            index <= tabs.findIndex(t => t.id === activeTab)
              ? 'bg-blue-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  </div>

  <div className="flex space-x-3">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
      disabled={loading}
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
    >
      {loading ? (
        <>
   <svg 
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>          <span>Saving...</span>
        </>
      ) : (
        <span>
          {activeTab === 'details' 
            ? (lead ? 'Update Lead' : 'Create Lead')
            : 'Next'}
        </span>
         )}
                    </button>

<button
  type="submit"
  disabled={loading}
  onClick={(e) => console.log('Button clicked')} // Add this
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <svg 
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>Saving...</span>
    </>
  ) : (
    lead ? 'Update Lead' : 'Create Lead'
  )}
</button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

LeadForm.propTypes = {
  lead: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    preferredContact: PropTypes.string,
    vehicle: PropTypes.string,
    budget: PropTypes.string,
    timeframe: PropTypes.string,
    source: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    assignedTo: PropTypes.string,
    followUpDate: PropTypes.string,
    notes: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  availableVehicles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      // Add other vehicle properties as necessary
    })
  ).isRequired,
};

// Removed defaultProps and used default parameters instead

export default LeadForm;
