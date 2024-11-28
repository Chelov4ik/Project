import axios from 'axios';
 
const API = axios.create({
  baseURL: 'http://localhost:5283',  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;