import axios from 'axios';

const photosAPI = axios.create({
  baseURL: 'http://localhost:5283', // Используйте новый порт
});

export default photosAPI;