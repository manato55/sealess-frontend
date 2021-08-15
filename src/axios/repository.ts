import axios from 'axios';

const repository = axios.create();

repository.interceptors.request.use((config) => {
  config.baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  return config;
});

export default repository;
