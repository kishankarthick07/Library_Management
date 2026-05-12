import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMember(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setMember(data.member);
    } catch {
      localStorage.removeItem('token');
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setMember(data.member);
    toast.success('Welcome back');
    return data;
  };

  const register = async (body) => {
    const { data } = await api.post('/auth/register', body);
    localStorage.setItem('token', data.token);
    setMember(data.member);
    toast.success('Account created');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMember(null);
    toast.success('Signed out');
  };

  const value = useMemo(
    () => ({
      member,
      loading,
      isAdmin: member?.role === 'admin',
      login,
      register,
      logout,
      refresh: loadMe,
    }),
    [member, loading, loadMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
