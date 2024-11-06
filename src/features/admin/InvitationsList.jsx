import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { X, RefreshCw } from 'lucide-react';

const InvitationsList = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = () => {
    const savedInvitations = storage.get(STORAGE_KEYS.INVITATIONS) || [];
    setInvitations(savedInvitations);
  };

  const handleRevoke = (invitationId) => {
    const updatedInvitations = invitations.filter(inv => inv.id !== invitationId);
    storage.set(STORAGE_KEYS.INVITATIONS, updatedInvitations);
    setInvitations(updatedInvitations);
  };

  const handleResend = async (invitation) => {
    try {
      await emailService.sendInvitation(invitation.email, invitation);
      // Update last sent timestamp
      const updatedInvitations = invitations.map(inv => 
        inv.id === invitation.id 
          ? { ...inv, lastResent: new Date().toISOString() }
          : inv
      );
      storage.set(STORAGE_KEYS.INVITATIONS, updatedInvitations);
      setInvitations(updatedInvitations);
    } catch (error) {
      console.error('Error resending invitation:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Pending Invitations</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <tr key={invitation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invitation.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invitation.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleResend(invitation)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRevoke(invitation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvitationsList;