const USERS_KEY = 'ims_users';
const CURRENT_USER_KEY = 'ims_current_user';

export const storageUtil = {
  getAllUsers: () => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  saveUser: (user: any) => {
    const users = storageUtil.getAllUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string) => {
    const users = storageUtil.getAllUsers();
    return users.find((u: any) => u.email === email && !u.deletedAt);
  },

  setCurrentUser: (user: any) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  clearCurrentUser: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};
