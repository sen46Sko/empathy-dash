import { z } from 'zod';
import dayjs from 'dayjs';

export interface Client {
  id: number,
  email: string,
  full_name: string,
  birthday: string,
  therapy_type: string,
  created_at: string,
  notes: string,
}

export interface ClientsState {
  clients: Client[],
  currentPage: number,
  totalClients: number,
  sortBy: ClientSortByEnum,
  rows: number
}

export interface GetClientsResponse {
  totalPatients: number;
  totalPages: number;
  currentPage: number;
  data: Client[];
  success: boolean;
}
export interface GetClientByIdResponse {
  data: Client,
  success: boolean,
}

export interface EditClientResponse {
  data: Client,
  success: boolean,
}

export interface CreateClientDTO {
  full_name: string;
  email: string;
  birthday: string;
  therapy_type: string,
  notes: string,
}

export enum ClientSortByEnum {
  Name = 'full_name',
  Email = 'email',
  Birthday = 'birthday',
  TherapyType = 'therapy_type',
  CreatedAt = 'created_at',
}
