// @ts-check
/**
 * @fileoverview CreditDNA localStorage database layer
 */

/**
 * @typedef {Object} User
 * @property {number}  id
 * @property {string}  name
 * @property {string}  email
 * @property {string}  password
 * @property {string}  phone
 * @property {string}  occ
 * @property {string}  txn
 * @property {string}  upiApp
 * @property {boolean} isAdmin
 * @property {number|null} score
 * @property {string}  joined
 */

const KEYS = {
  USERS: 'cdna_users',
  ME:    'cdna_me',
};

export const DB = {
  /** @returns {User[]} */
  users: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'); }
    catch { return []; }
  },

  /** @param {User[]} u */
  save: u => localStorage.setItem(KEYS.USERS, JSON.stringify(u)),

  /** @returns {User|null} */
  me: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.ME) || 'null'); }
    catch { return null; }
  },

  /** @param {User} u */
  setMe: u => localStorage.setItem(KEYS.ME, JSON.stringify(u)),

  logout: () => localStorage.removeItem(KEYS.ME),

  /**
   * Find user by email
   * @param {string} email
   * @returns {User|undefined}
   */
  findByEmail: email =>
    DB.users().find(u => u.email.toLowerCase() === email.toLowerCase()),

  /**
   * Update a user record
   * @param {Partial<User> & {id:number}} patch
   */
  updateUser: patch => {
    const users = DB.users();
    const i = users.findIndex(u => u.id === patch.id);
    if (i > -1) {
      users[i] = { ...users[i], ...patch };
      DB.save(users);
      // If this is the current user, update session
      const me = DB.me();
      if (me && me.id === patch.id) DB.setMe(users[i]);
      return users[i];
    }
    return null;
  },

  /**
   * Delete a user by id
   * @param {number} id
   */
  deleteUser: id => {
    const users = DB.users().filter(u => u.id !== id);
    DB.save(users);
  },
};
