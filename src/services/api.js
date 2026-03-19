import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cafe-backend-qqn4.onrender.com'
});

export default api;