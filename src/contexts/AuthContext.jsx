import { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

// Separate hook definition
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER));
  const [company, setCompany] = useState(() => storage.get(STORAGE_KEYS.COMPANY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.get(STORAGE_KEYS.USER);
    const savedCompany = storage.get(STORAGE_KEYS.COMPANY);

    if (savedUser) setUser(savedUser);
    if (savedCompany) setCompany(savedCompany);
    
    setLoading(false);
  }, []);

  const register = async (formData) => {
    try {
      const newCompany = {
        id: Date.now(),
        name: formData.companyName,
        plan: formData.plan,
        address: formData.address,
        phone: formData.phone,
        createdAt: new Date().toISOString()
      };

      const newUser = {
        id: Date.now() + 1,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'superadmin',
        companyId: newCompany.id,
        createdAt: new Date().toISOString()
      };

      const initialUsers = [newUser];

      storage.set(STORAGE_KEYS.COMPANY, newCompany);
      storage.set(STORAGE_KEYS.USER, newUser);
      storage.set(STORAGE_KEYS.USERS, initialUsers);
      storage.set(STORAGE_KEYS.INVITATIONS, []);

      setCompany(newCompany);
      setUser(newUser);

      return { user: newUser, company: newCompany };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const login = async (email, password) => {
    try {
      const users = storage.get(STORAGE_KEYS.USERS) || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new Error('User not found');
      }

      const company = storage.get(STORAGE_KEYS.COMPANY);

      storage.set(STORAGE_KEYS.USER, user);
      
      setUser(user);
      setCompany(company);

      return { user, company };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    storage.remove(STORAGE_KEYS.USER);
    setUser(null);
    setCompany(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      company,
      register,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export everything separately
export { AuthProvider, useAuth, AuthContext };