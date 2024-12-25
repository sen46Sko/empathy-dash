import type { AxiosInstance } from 'axios';
import { ClientRoutes } from '@/api/routes/routes';
import type { ErrorResponse } from '@/types/core/core.types';
import {
  ClientSortByEnum,
  CreateClientDTO, EditClientResponse,
  GetClientByIdResponse, GetClientsListResponse,
  GetClientsResponse
} from '@/types/clients/clients.types';

export class ClientClient {
  
  async getClients(axios: AxiosInstance, rows = 12, page = 1, sortBy = ClientSortByEnum.CreatedAt) {
    try {
      const response = await axios.get<GetClientsResponse>(`${ClientRoutes.GetPatients}?rows=${rows}&page=${page}&sortBy=${sortBy}&orderBy=asc&status=active`);
      
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
  
  async getClientsList(axios: AxiosInstance) {
    try {
      const response = await axios.get<GetClientsListResponse>(ClientRoutes.GetPatientsList);
      
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
  
  async getClientById(axios: AxiosInstance, id: number) {
    try {
      const response = await axios.get<GetClientByIdResponse>(`${ClientRoutes.GetPatients}/${id}`);
      
      return { data: response.data }
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async postClient(axios: AxiosInstance, values: CreateClientDTO) {
    try {
      const response = await axios.post<GetClientsResponse>(ClientRoutes.CreatePatient, values);
      
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
  
  async editClient(axios: AxiosInstance, id: number, values: CreateClientDTO) {
    try {
      const response = await axios.put<EditClientResponse>(`${ClientRoutes.EditPatient}/${id}`, values);
      
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

export const clientClient = new ClientClient();
