// api.js
import axios,{AxiosRequestConfig, AxiosResponse} from 'axios';

const instance = axios.create({
  baseURL: 'https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors (optional)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error?.response || error.message);
    return Promise.reject(error);
  }
);

interface ApiInterface {
    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
}

const Api: ApiInterface = {
    get: (url, config = {}) => instance.get(url, config),
    post: (url, data, config = {}) => instance.post(url, data, config),
    put: (url, data, config = {}) => instance.put(url, data, config),
    delete: (url, config = {}) => instance.delete(url, config),
};

export default Api;
