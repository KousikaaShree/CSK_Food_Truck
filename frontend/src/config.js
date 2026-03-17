import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "https://csk-food-truck-backend.onrender.com";
axios.defaults.withCredentials = true;

export default API_URL;
