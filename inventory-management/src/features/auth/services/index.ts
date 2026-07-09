import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { storageUtil } from '@/utils/localStorage';

const generateId = () => `user_${Date.now()}`;
const getCurrentTimestamp = () => new Date().toISOString();

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<User> => {
    const { firstName, lastName, email, password } = credentials;

    // Check if user exists
    const existingUser = storageUtil.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists. Please log in or use a different email address.');
    }

    const newUser: User = {
      id: generateId(),
      firstName,
      lastName,
      email,
      password, // In production, this should be hashed
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      deletedAt: null,
    };

    storageUtil.saveUser(newUser);
    return newUser;
  },

  login: async (credentials: LoginCredentials): Promise<Omit<User, 'password'>> => {
    const { email, password } = credentials;

    const user = storageUtil.getUserByEmail(email);
    if (!user) {
      throw new Error('Email not found. Please sign up as a new user.');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    storageUtil.setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  },

  logout: () => {
    storageUtil.clearCurrentUser();
  },

  getCurrentUser: () => {
    return storageUtil.getCurrentUser();
  },

  isAuthenticated: () => {
    return !!storageUtil.getCurrentUser();
  },
};
