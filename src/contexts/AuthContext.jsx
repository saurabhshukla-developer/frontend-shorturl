import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          console.log('Initializing auth with token:', token ? 'exists' : 'missing');
          // Verify token and get user profile
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
          console.log('Auth initialized successfully');
        } else {
          console.log('No token found, setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Clear invalid tokens
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      console.log('Login attempt with credentials:', { email: credentials.email });
      const response = await authService.login(credentials);
      console.log('Login response received:', response);
      
      const { tokens, user: userData } = response;
      console.log('Tokens received:', { accessToken: tokens.accessToken ? 'exists' : 'missing', refreshToken: tokens.refreshToken ? 'exists' : 'missing' });
      
      setToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('token', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      console.log('Login state updated, tokens stored in localStorage');
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Call logout API
    if (token) {
      authService.logout().catch(console.error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Password change failed');
      return { success: false, error: error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Password reset request failed');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      await authService.resetPassword(resetData);
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
      return { success: false, error: error.message };
    }
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authService.refreshToken(refreshToken);
      const { tokens } = response;
      
      setToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      localStorage.setItem('token', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      return tokens.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
