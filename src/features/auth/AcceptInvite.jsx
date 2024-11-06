import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '../../utils/storage';

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    validateInvitation();
  }, [token]);

  const validateInvitation = () => {
    try {
      const invitations = storage.get(STORAGE_KEYS.INVITATIONS) || [];
      const invitation = invitations.find(inv => inv.token === token);

      if (!invitation) {
        setError('Invalid invitation token');
        return;
      }

      // Check if invitation has expired
      if (new Date(invitation.expiresAt) < new Date()) {
        setError('This invitation has expired');
        return;
      }

      setLoading(false);
    } catch (err) {
      setError('Error validating invitation');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const invitations = storage.get(STORAGE_KEYS.INVITATIONS) || [];
      const invitation = invitations.find(inv => inv.token === token);

      if (!invitation) {
        throw new Error('Invalid invitation');
      }

      // Create new user
      const users = storage.get(STORAGE_KEYS.USERS) || [];
      const newUser = {
        id: Date.now(),
        email: invitation.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: invitation.role,
        companyId: invitation.companyId,
        createdAt: new Date().toISOString()
      };

      // Add user and remove invitation
      storage.set(STORAGE_KEYS.USERS, [...users, newUser]);
      storage.set(
        STORAGE_KEYS.INVITATIONS,
        invitations.filter(inv => inv.token !== token)
      );

      // Navigate to login
      navigate('/login', { 
        state: { message: 'Account created successfully. Please log in.' }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">{error}</div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Account Setup
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Complete Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvite;