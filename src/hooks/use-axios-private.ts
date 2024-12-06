import { useUser } from '@/hooks/use-user';
import { axiosPrivate } from '@/api/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

export function useAxiosPrivate() {
  const { token, setUser } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response, // Якщо відповідь успішна
      async (error) => {
        if (error?.response?.status === 401) {
          setUser(null, null);
          router.push(paths.auth.custom.signIn);
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [token, router]);
  
  
  // TODO
  // add response interceptor
  
  return axiosPrivate;
}
