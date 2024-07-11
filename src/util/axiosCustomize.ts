import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosClient = axios.create({
    // baseURL: 'https://api.hometravel.io.vn/api/v1/',
    baseURL: 'https://home-travel-v1.azurewebsites.net/api/v1/',
     //baseURL: 'https://api.hometravel.io.vn/api/v1/',
    
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        const access_token = localStorage.getItem('access_token');
        config.headers.Authorization = `Bearer ${access_token}`;
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    async (error) => {
        if (error?.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export default axiosClient;
