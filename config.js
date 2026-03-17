// @ts-check
/**
 * @fileoverview CreditDNA configuration constants
 */

/** @type {string[]} Admin email list */
export const ADMIN_EMAILS = [
  'simon@creditdna.in',
  'mayank@creditdna.in',
  'varsha@creditdna.in',
  'deva@creditdna.in',
  'admin@creditdna.in',
];

/** Admin portal secret key */
export const ADMIN_KEY = 'CDNA2025';

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} date
 * @property {string} merchant
 * @property {string} cat
 * @property {number} amt
 * @property {boolean} credit
 * @property {string} upi
 * @property {string} ico
 */

/** @type {Transaction[]} Demo transaction data */
export const MOCK_TXN = [
  { id:'T1',  date:'14 Mar', merchant:'Swiggy',            cat:'Food',       amt:-340,  credit:false, upi:'swiggy@icici',  ico:'🍔' },
  { id:'T2',  date:'13 Mar', merchant:'BESCOM Electricity', cat:'Utilities',  amt:-1240, credit:false, upi:'bescom@sbi',    ico:'⚡' },
  { id:'T3',  date:'13 Mar', merchant:'Salary Credit',      cat:'Income',     amt:25000, credit:true,  upi:'employer@hdfc', ico:'💰' },
  { id:'T4',  date:'12 Mar', merchant:'Zomato',             cat:'Food',       amt:-280,  credit:false, upi:'zomato@kotak',  ico:'🍕' },
  { id:'T5',  date:'11 Mar', merchant:'DMart',              cat:'Groceries',  amt:-1850, credit:false, upi:'dmart@axis',    ico:'🛒' },
  { id:'T6',  date:'10 Mar', merchant:'Airtel Recharge',    cat:'Utilities',  amt:-399,  credit:false, upi:'airtel@airtel', ico:'📱' },
  { id:'T7',  date:'09 Mar', merchant:'Rapido',             cat:'Transport',  amt:-95,   credit:false, upi:'rapido@ybl',    ico:'🛵' },
  { id:'T8',  date:'08 Mar', merchant:'Freelance Payment',  cat:'Income',     amt:5000,  credit:true,  upi:'client@paytm',  ico:'💼' },
  { id:'T9',  date:'07 Mar', merchant:'Amazon',             cat:'Shopping',   amt:-1299, credit:false, upi:'amazon@apl',    ico:'📦' },
  { id:'T10', date:'06 Mar', merchant:'BWSSB Water Bill',   cat:'Utilities',  amt:-480,  credit:false, upi:'bwssb@sbi',     ico:'💧' },
  { id:'T11', date:'05 Mar', merchant:'Ola Auto',           cat:'Transport',  amt:-65,   credit:false, upi:'ola@ola',       ico:'🚗' },
  { id:'T12', date:'04 Mar', merchant:'Jio Recharge',       cat:'Utilities',  amt:-299,  credit:false, upi:'jio@jio',       ico:'📶' },
];

/** Occupation labels */
export const OCC_LABELS = {
  gig:      'Gig Worker',
  farmer:   'Farmer',
  student:  'Student',
  sme:      'Business Owner',
  daily:    'Daily Wage Worker',
  freelance:'Freelancer',
  salaried: 'Salaried Employee',
  other:    'Other',
};

/**
 * Score colour helper
 * @param {number|null} s
 * @returns {string}
 */
export const scoreColor = s =>
  !s ? '#8c7d6a' : s >= 750 ? '#0f7e5a' : s >= 650 ? '#0d7c52' : s >= 550 ? '#d4500f' : '#c0392b';

/**
 * Score tier label
 * @param {number|null} s
 * @returns {string}
 */
export const scoreTier = s =>
  !s ? '—' : s >= 750 ? 'Very Good' : s >= 650 ? 'Good' : s >= 550 ? 'Fair' : 'Poor';

/**
 * Score percentage (300–900 range)
 * @param {number|null} s
 * @returns {number}
 */
export const scorePct = s => !s ? 0 : ((s - 300) / 600 * 100);

/**
 * Format Indian currency amount
 * @param {number} n
 * @returns {string}
 */
export const fmtAmt = n =>
  n > 0
    ? `+₹${n.toLocaleString('en-IN')}`
    : `−₹${Math.abs(n).toLocaleString('en-IN')}`;

/**
 * Check if user is admin
 * @param {{email:string}|null} u
 * @returns {boolean}
 */
export const isAdmin = u => !!(u && ADMIN_EMAILS.includes((u.email || '').toLowerCase()));
