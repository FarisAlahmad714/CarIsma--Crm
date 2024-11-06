import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext(null);

// Role hierarchy and permissions
const ROLE_HIERARCHY = {
  superadmin: {
    level: 3,
    permissions: [
      'MANAGE_USERS',
      'MANAGE_ADMINS',
      'MANAGE_COMPANY',
      'VIEW_ANALYTICS',
      'MANAGE_INVENTORY',
      'MANAGE_LEADS',
      'MANAGE_SETTINGS',
      'INVITE_USERS',
      'DELETE_USERS',
      'VIEW_BILLING',
      'MANAGE_ROLES'
    ]
  },
  admin: {
    level: 2,
    permissions: [
      'MANAGE_USERS',
      'VIEW_ANALYTICS',
      'MANAGE_INVENTORY',
      'MANAGE_LEADS',
      'MANAGE_SETTINGS',
      'INVITE_USERS'
    ]
  },
  manager: {
    level: 1,
    permissions: [
      'VIEW_ANALYTICS',
      'MANAGE_INVENTORY',
      'MANAGE_LEADS',
      'VIEW_SETTINGS'
    ]
  },
  employee: {
    level: 0,
    permissions: [
      'VIEW_INVENTORY',
      'MANAGE_LEADS',
      'VIEW_BASIC_ANALYTICS'
    ]
  }
};

export const AdminProvider = ({ children }) => {
  const { user, company } = useAuth();
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if current user can perform an action
  const canPerformAction = (action) => {
    if (!user || !user.role) return false;
    return ROLE_HIERARCHY[user.role].permissions.includes(action);
  };

  // Check if current user can manage target user
  const canManageUser = (targetUserRole) => {
    if (!user || !user.role) return false;
    return ROLE_HIERARCHY[user.role].level > ROLE_HIERARCHY[targetUserRole].level;
  };

  // Invite new user
  const inviteUser = async (email, role) => {
    try {
      if (!canPerformAction('INVITE_USERS')) {
        throw new Error('Unauthorized to invite users');
      }

      if (!canManageUser(role)) {
        throw new Error('Cannot assign a role equal to or higher than your own');
      }

      // Check plan limits
      const userCount = users.length;
      const planLimits = {
        basic: 5,
        premium: 15,
        enterprise: Infinity
      };

      if (userCount >= planLimits[company.plan]) {
        throw new Error(`User limit reached for ${company.plan} plan`);
      }

      const invitation = {
        id: Date.now(),
        email,
        role,
        companyId: company.id,
        invitedBy: user.id,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      // TODO: Replace with API call
      setInvitations(prev => [...prev, invitation]);
      
      // TODO: Implement email sending logic
      
      return invitation;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) throw new Error('User not found');

      if (!canManageUser(targetUser.role) || !canManageUser(newRole)) {
        throw new Error('Unauthorized to modify this users role');
      }

      // TODO: Replace with API call
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) throw new Error('User not found');

      if (!canManageUser(targetUser.role) || !canPerformAction('DELETE_USERS')) {
        throw new Error('Unauthorized to delete this user');
      }

      // TODO: Replace with API call
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Revoke invitation
  const revokeInvitation = async (invitationId) => {
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error('Invitation not found');

      if (!canManageUser(invitation.role)) {
        throw new Error('Unauthorized to revoke this invitation');
      }

      // TODO: Replace with API call
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      invitations,
      canPerformAction,
      canManageUser,
      inviteUser,
      updateUserRole,
      deleteUser,
      revokeInvitation,
      loading,
      error
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};