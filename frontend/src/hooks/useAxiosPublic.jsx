import axios from 'axios';

// Base URL now comes from an env var instead of being hardcoded to localhost,
// so the same build works in dev and once it's actually deployed.
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
