import axios from 'axios'; 

const instance = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_ENDOPOINT
}); 

instance.interceptors.request.use(
    (config) => {
        axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_ENDOPOINT
        config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }
);

export default instance;
