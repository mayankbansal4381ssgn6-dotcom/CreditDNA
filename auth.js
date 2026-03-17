// @ts-check
import { DB } from './db.js';
import { ADMIN_EMAILS, isAdmin } from './config.js';
import { toast } from './toast.js';

/**
 * @typedef {import('./db.js').User} User
 */

/**
 * Attempt login
 * @param {string} email
 * @param {string} password
 * @returns {User|null}
 */
export function doLogin(email, password) {
  const user = DB.findByEmail(email);
  if (!user || user.password !== password) return null;
  DB.setMe(user);
  return user;
}

/**
 * Register a new user
 * @param {{name:string, email:string, password:string, phone:string, occ:string, txn:string, upiApp:string}} data
 * @returns {User|false}
 */
export function doRegister(data) {
  if (DB.findByEmail(data.email)) {
    toast('This email is already registered', 'err');
    return false;
  }

  const isAdm = ADMIN_EMAILS.includes(data.email.toLowerCase());

  /** @type {User} */
  const user = {
    id:      Date.now(),
    name:    data.name,
    email:   data.email.toLowerCase(),
    password:data.password,
    phone:   data.phone || '',
    occ:     data.occ,
    txn:     data.txn,
    upiApp:  data.upiApp,
    isAdmin: isAdm,
    score:   null,
    joined:  new Date().toISOString(),
  };

  const users = DB.users();
  users.push(user);
  DB.save(users);
  DB.setMe(user);

  toast(isAdm ? '👑 Admin account created!' : '🎉 Welcome to CreditDNA!', 'ok');
  return user;
}

/**
 * Logout current user
 */
export function doLogout() {
  DB.logout();
  toast('See you soon!', 'info');
}
