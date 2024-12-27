import { axiosNotesPublic, axiosPublic } from '@/api/api';

class ApiService {

  async post<T>(url: string, data: any, axios = axiosPublic): Promise<T> {
    const response = await axios.post<T>(url, data);
    return response.data;
  }

  async get<T>(url: string, axios = axiosPublic): Promise<T> {
    const response = await axios.get<T>(url);
    return response.data;
  }

  async put<T>(url: string, data: any, axios = axiosPublic): Promise<T> {
    const response = await axios.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string, axios = axiosPublic): Promise<T> {
    const response = await axios.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();

class NotesApiService {
  
  async post<T>(url: string, data: any, axios = axiosNotesPublic): Promise<T> {
    const response = await axios.post<T>(url, data);
    return response.data;
  }
  
  async get<T>(url: string, axios = axiosNotesPublic): Promise<T> {
    const response = await axios.get<T>(url);
    return response.data;
  }
  
  async put<T>(url: string, data: any, axios = axiosNotesPublic): Promise<T> {
    const response = await axios.put<T>(url, data);
    return response.data;
  }
  
  async delete<T>(url: string, axios = axiosNotesPublic): Promise<T> {
    const response = await axios.delete<T>(url);
    return response.data;
  }
}

export const notesApiService = new NotesApiService();
