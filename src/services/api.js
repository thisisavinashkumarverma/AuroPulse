import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

const unwrap = (res) => res.data;

/** Generic CRUD wrapper around a JSON Server collection. */
const resource = (name) => ({
  list: (params = {}) => http.get(`/${name}`, { params }).then(unwrap),
  get: (id) => http.get(`/${name}/${id}`).then(unwrap),
  create: (data) => http.post(`/${name}`, data).then(unwrap),
  update: (id, data) => http.patch(`/${name}/${id}`, data).then(unwrap),
  remove: (id) => http.delete(`/${name}/${id}`).then(unwrap),
});

export const usersApi = resource('users');
export const adminsApi = resource('admins');
export const doctorsApi = resource('doctors');
export const patientsApi = resource('patients');
export const appointmentsApi = resource('appointments');
export const reportsApi = resource('reports');
export const medicinesApi = resource('medicines');
export const ordersApi = resource('orders');
export const remindersApi = resource('reminders');
export const invoicesApi = resource('invoices');
export const messagesApi = resource('messages');

export const authApi = {
  async login(mobile, password) {
    const users = await usersApi.list({ mobile, password });
    return users[0] || null;
  },
  async signup({ name, mobile, email, password }) {
    const [byMobile, byEmail] = await Promise.all([
      usersApi.list({ mobile }),
      usersApi.list({ email }),
    ]);
    if (byMobile.length) throw new Error('This mobile number is already registered.');
    if (byEmail.length) throw new Error('This email is already registered.');
    const createdAt = new Date().toISOString().slice(0, 10);
    const user = await usersApi.create({
      name, mobile, email, password, role: 'patient',
      age: '', gender: '', bloodGroup: '', address: '', createdAt,
      settings: { emailAlerts: true, smsAlerts: true, reminderAlerts: true },
    });
    await patientsApi.create({
      userId: user.id, name, mobile, email, age: '', gender: '', bloodGroup: '', address: '', createdAt,
    });
    return user;
  },
  async adminLogin(email, password) {
    const admins = await adminsApi.list({ email, password });
    return admins[0] || null;
  },
};

/** Human friendly error message for UI toasts. */
export function errMsg(err) {
  if (err?.response) return `Server error (${err.response.status}). Please try again.`;
  if (err?.request) return 'Cannot reach JSON Server. Start it with "npm run server".';
  return err?.message || 'Something went wrong.';
}
