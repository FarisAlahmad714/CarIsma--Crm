import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { storage, STORAGE_KEYS } from '../../utils/storage';

const InviteForm = ({ onClose, onSuccess }) => {
  const { user, company } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    role: 'employee'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting invitation process...'); // Debug log

      // Create invitation token
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Create invitation object
      const invitation = {
        id: Date.now(),
        email: formData.email,
        role: formData.role,
        token,
        companyId: company.id,
        companyName: company.name,
        invitedBy: user.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      console.log('Invitation object:', invitation); // Debug log

      // Send invitation email
      const emailResult = await emailService.sendInvitation(formData.email, invitation);
      console.log('Email result:', emailResult); // Debug log

      // Save invitation to storage
      const invitations = storage.get(STORAGE_KEYS.INVITATIONS) || [];
      storage.set(STORAGE_KEYS.INVITATIONS, [...invitations, invitation]);

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Error in handleSubmit:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Invite New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                {user?.role === 'superadmin' && (
                  <option value="admin">Admin</option>
                )}
              </select>
            </div>

            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </form>

        {/* Debug info - remove in production */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Debug Info:</p>
          <p>Email: {formData.email}</p>
          <p>Role: {formData.role}</p>
          <p>User Role: {user?.role}</p>
          <p>Company: {company?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default InviteForm;