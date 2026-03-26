import axios from 'axios';

// For Vite projects, environment variables must start with VITE_
// In AWS S3 setup, make sure to set VITE_API_URL when building
// Example: VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Centralized Axios Configuration for Best Practices
axios.defaults.withCredentials = true;

export default API_URL;
