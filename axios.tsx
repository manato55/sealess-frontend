import axios from 'axios'; 

const instance = axios.create({
    baseURL : 'http://127.0.0.1:82/api'
}); 

instance.interceptors.request.use(
    (config) => {
        axios.defaults.baseURL = 'http://127.0.0.1:82/api/'
        config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }
);

export default instance;
