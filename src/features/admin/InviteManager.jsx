import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validateEmail, generateInviteToken } from '../../utils/emailUtils';
import { Mail, X } from 'lucide-react';

const InviteManager = () => {
  const { user, company } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate email
      if (!validateEmail(inviteEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // Check permissions
      if (!['superadmin', 'admin'].includes(user.role)) {
        throw new Error('You do not have permission to invite users');
      }

      // Create invitation
      const invitation = {
        id: Date.now(),
        email: inviteEmail,
        role,
        companyId: company.id,
        companyName: company.name,
        invitedBy: user.id,
        status: 'pending',
        token: generateInviteToken(),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Send invitation email
      await emailService.sendInvitation(inviteEmail, invitation);

      // Save invitation to storage
      const invitations = storage.get(STORAGE_KEYS.INVITATIONS) || [];
      storage.set(STORAGE_KEYS.INVITATIONS, [...invitations, invitation]);

      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setRole('employee');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Invite Team Members</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <X className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="colleague@company.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            {user.role === 'superadmin' && (
              <option value="admin">Admin</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>
    </div>
  );
};

export default InviteManager;