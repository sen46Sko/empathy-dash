import type { AxiosInstance } from 'axios';
import { ClientRoutes, TherapistsRoutes } from '@/api/routes/routes';
import type { ErrorResponse } from '@/types/core/core.types';
import { CreateTherapistDTO, GetTherapistResponse, GetTherapistsResponse } from '@/types/therapists/therapists.types';
import { TherapistsSortByEnum } from '@/types/therapists/therapists.types';
import { CreateClientDTO, GetClientsResponse } from '@/types/clients/clients.types';

export class TherapistsClient {
  async getTherapists(axios: AxiosInstance, rows = 12, page = 1, sortBy = TherapistsSortByEnum.CreatedAt) {
    try {
      const response = await axios.get<GetTherapistsResponse>(`${TherapistsRoutes.GetTherapists}?rows=${rows}&page=${page}&sortBy=${sortBy}&orderBy=asc&status=active`);
      
      return { data: response}
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async getTherapistById(axios: AxiosInstance, id: number) {
    try {
      const response = await axios.get<GetTherapistResponse>(`${TherapistsRoutes.GetTherapists}/${id}`);
      
      return { data: response.data}
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async postTherapist(axios: AxiosInstance, values: CreateTherapistDTO) {
    try {
      const response = await axios.post<GetClientsResponse>(TherapistsRoutes.CreateTherapist, values);
      
      return {data: response}
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async editTherapist(axios: AxiosInstance, values: CreateTherapistDTO, id: number) {
    try {
      const response = await axios.put<GetClientsResponse>(`${TherapistsRoutes.EditTherapist}/${id}`, values);
      
      return {data: response}
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
}

export const therapistsClient = new TherapistsClient();
