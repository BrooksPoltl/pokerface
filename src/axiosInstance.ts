import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'https://gaga-pokerface.herokuapp.com/api';
const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
