import { BASE_URI } from '@/constants/core/core.constants';
import axios from 'axios';

export const axiosPublic = axios.create({
  baseURL: `${BASE_URI}/api`,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: `${BASE_URI}/api`,
  withCredentials: true,
});
