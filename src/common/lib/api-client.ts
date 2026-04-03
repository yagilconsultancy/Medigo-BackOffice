import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';
import { getAuthToken, handleLogout } from '../utils';

let apiClient: AxiosInstance | null = null;

const cookie = parseCookies();

const isLoginRoute = (route?: string) => route && route.includes('/login');

export const getApiClient = () => {
  if (apiClient) {
    return apiClient;
  }

  const baseURL = process.env['NEXT_PUBLIC_BASE_API_URL'];

  if (!baseURL) {
    throw new Error(
      'NEXT_PUBLIC_BASE_API_URL is not defined in environment variables'
    );
  }

  apiClient = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    validateStatus: (status) => status >= 200 && status !== 401,
  });

  apiClient.interceptors.response.use(
    (response) => {
      // Don't intercept if the route is a login route
      if (isLoginRoute(response.config.url)) {
        return response;
      }

      if (response.status === 401) {
        // Handle unauthorized access
        handleLogout();
      }

      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Don't intercept if the route is a login route
        if (isLoginRoute(error.config.url)) {
          return Promise.reject(error);
        }

        // Handle unauthorized access
        handleLogout();
      }
      return Promise.reject(error);
    }
  );

  // add interceptor to requests to set the bearer token
  apiClient.interceptors.request.use((config) => {
    // Don't intercept if the route is a login route
    if (isLoginRoute(config.url)) {
      return config;
    }

    // const token = cookie['medi_auth'];
    const token = getAuthToken();
    // console.log("token", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiClient;
};
