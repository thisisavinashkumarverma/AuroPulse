import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authApi, patientsApi, usersApi } from '../services/api';
import { safeUser } from '../utils/helpers';

const AuthContext = createContext(null);
const USER_KEY = 'auropulse_user';
const ADMIN_KEY = 'auropulse_admin';

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(USER_KEY));
  const [admin, setAdmin] = useState(() => read(ADMIN_KEY));

  const login = useCallback(async (mobile, password) => {
    const found = await authApi.login(mobile, password);
    if (!found) throw new Error('Invalid mobile number or password.');
    const session = safeUser(found);
    localStorage.setItem(USER_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }, []);

  const signup = useCallback(async (data) => {
    const created = await authApi.signup(data);
    const session = safeUser(created);
    localStorage.setItem(USER_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  /** Update the profile in db.json (users + linked patients record) and refresh the session. */
  const updateUser = useCallback(async (changes) => {
    const saved = await usersApi.update(user.id, changes);
    const linked = await patientsApi.list({ userId: user.id });
    if (linked[0]) {
      const { password, settings, role, ...patientFields } = changes; // eslint-disable-line no-unused-vars
      if (Object.keys(patientFields).length) await patientsApi.update(linked[0].id, patientFields);
    }
    const session = safeUser(saved);
    localStorage.setItem(USER_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }, [user]);

  const adminLogin = useCallback(async (email, password) => {
    const found = await authApi.adminLogin(email, password);
    if (!found) throw new Error('Invalid admin email or password.');
    const session = safeUser(found);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    setAdmin(session);
    return session;
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ user, admin, login, signup, logout, updateUser, adminLogin, adminLogout }),
    [user, admin, login, signup, logout, updateUser, adminLogin, adminLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
