import axios from 'axios';

// Установим базовый URL для всех запросов
const API = axios.create({
  baseURL: 'http://localhost:5283', // Укажи здесь свой API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
