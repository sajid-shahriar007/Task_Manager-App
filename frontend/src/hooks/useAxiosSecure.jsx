import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase.config';

// Authenticated axios instance: attaches the current user's Firebase ID token
// to every request, so the backend can verify who's calling without a
// separate hand-rolled JWT secret to manage.
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

axiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useAxiosSecure = () => axiosSecure;

export default useAxiosSecure;
