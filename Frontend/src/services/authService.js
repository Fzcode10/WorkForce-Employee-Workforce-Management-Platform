import api from './api';
import { DEMO_ACCOUNTS } from '../data/mockUsers';

// ---------------------------------------------------------------------------
// Auth Service — Mock layer (replace body with real API calls when backend is live)
// ---------------------------------------------------------------------------

const STORAGE_KEY_TOKEN = 'wfx_token';
const STORAGE_KEY_USER = 'wfx_user';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Login — Demo mode: matches against local mock accounts.
   * When backend is ready, replace with: return api.post('/auth/login', { email, password })
   */
  async login(email, password) {
    await delay(800); // Simulate network latency
    const user = DEMO_ACCOUNTS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) throw new Error('Invalid email or password.');

    const mockToken = `mock-jwt-${user.role.toLowerCase()}-${Date.now()}`;
    const { password: _, ...safeUser } = user;

    localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(safeUser));

    return { token: mockToken, user: safeUser };
  },

  /**
   * Logout — clears local session.
   * When backend is ready, also call: api.post('/auth/logout')
   */
  async logout() {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  /**
   * Forgot Password — Demo stub.
   * When backend is ready, replace with: return api.post('/auth/forgot-password', { email })
   */
  async forgotPassword(email) {
    await delay(800);
    const exists = DEMO_ACCOUNTS.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) throw new Error('No account found with that email address.');
    return { message: 'Password reset link sent to your email.' };
  },

  /** Get current session user from localStorage */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /** Get stored token */
  getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  /** Check if session exists */
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },
};
