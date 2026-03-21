import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

export default API_URL;
