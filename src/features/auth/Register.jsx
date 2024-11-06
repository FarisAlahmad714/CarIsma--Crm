import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Check, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    plan: 'basic',
    role: 'superadmin' // Default role for initial registration
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$49/month',
      features: [
        'Up to 5 users',
        'Basic CRM features',
        'Email support',
        'Lead Management',
        'Basic Inventory',
        'Standard Reports'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99/month',
      features: [
        'Up to 15 users',
        'Advanced CRM features',
        'Priority support',
        'Advanced Analytics',
        'Custom Reports',
        'API Access',
        'Email Integration'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199/month',
      features: [
        'Unlimited users',
        'Custom features',
        '24/7 support',
        'Advanced Analytics',
        'White-label options',
        'Dedicated account manager',
        'Custom API integration'
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Register the user as a superadmin
      await register({
        ...formData,
        role: 'superadmin', // This ensures the first user is a superadmin
        permissions: [
          'MANAGE_USERS',
          'MANAGE_ADMINS',
          'MANAGE_COMPANY',
          'VIEW_ANALYTICS',
          'MANAGE_INVENTORY',
          'MANAGE_LEADS',
          'MANAGE_SETTINGS'
        ]
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Create Your Carisma Account</h1>
          <p className="mt-3 text-xl text-gray-600">Get started with your dealership CRM</p>
        </div>

        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-3" />
              {error}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Registration Form */}
            <div className="col-span-2 p-8 border-r border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                    Already have an account? Sign in
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 text-white rounded-lg ${
                      loading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>

            {/* Plans Selection */}
            <div className="bg-gray-50 p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Select Your Plan</h3>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleChange({ target: { name: 'plan', value: plan.id } })}
                    className={`relative p-4 rounded-lg cursor-pointer transition-all ${
                      formData.plan === plan.id
                        ? 'bg-white border-2 border-blue-500 shadow-md'
                        : 'bg-white border border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                      <span className="text-blue-600 font-semibold">{plan.price}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;