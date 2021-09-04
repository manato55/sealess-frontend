import Axios from 'axios';
import { Failure, FailureType, Success } from '../lib/result';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

  return config;
});

export function errorHanding(error: any): FailureType {
  if (!Axios.isAxiosError(error)) {
    return {
      code: 500,
      message: 'something wrong',
    };
  }

  if (!error.response) {
    return {
      code: 500,
      message: error.message,
    };
  }

  return {
    code: error.response.status,
    message: error.response.data.errors,
  };
}

export const repository = {
  get: axios.get,
  post: async (path: string, data: any, other?: any) => {
    try {
      const res = await axios.post(path, data, other);
      return new Success(res.data);
    } catch (error) {
      console.error(error.response);
      return new Failure(errorHanding(error));
    }
  },
  downloadPost: async (path: string, data: any, other?: any) => {
    try {
      const res = await axios.post(path, data, other);
      return new Success(res);
    } catch (error) {
      console.error(error.response);
      return new Failure(errorHanding(error));
    }
  },
  patch: async (path: string, data: any) => {
    try {
      const res = await axios.patch(path, data);
      return new Success(res.data);
    } catch (error) {
      console.error(error.response);
      return new Failure(errorHanding(error));
    }
  },
  delete: async (path: string) => {
    try {
      const res = await axios.delete(path);
      return new Success(res.data);
    } catch (error) {
      console.error(error.response);
      return new Failure(errorHanding(error));
    }
  },
};
