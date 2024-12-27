import { useUser } from '@/hooks/use-user';
import { axiosNotesPrivate } from '@/api/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

export function useNoteAxiosPrivate() {
  const { noteInfo, setNotesUser } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    const requestInterceptor = axiosNotesPrivate.interceptors.request.use(
      (config) => {
        if (noteInfo?.token) {
          config.headers['Authorization'] = `Bearer ${noteInfo?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    const responseInterceptor = axiosNotesPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          setNotesUser(null, null);
          router.push(paths.auth.notes.signIn);
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axiosNotesPrivate.interceptors.request.eject(requestInterceptor);
      axiosNotesPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [noteInfo?.token, router]);
  
  
  // TODO
  // add response interceptor
  
  return axiosNotesPrivate;
}
