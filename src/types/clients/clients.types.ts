import { SurveySchedule } from '@/helpers/survey.helper';

export interface Client {
  id: number,
  email: string,
  full_name: string,
  birthday: string,
  therapy_type: string,
  created_at: string,
  notes: string,
  SurveyResult: string[],
  surveys_schedule: SurveySchedule[],
}

export interface ClientsState {
  clients: Client[],
  currentPage: number,
  totalClients: number,
  sortBy: ClientSortByEnum,
  rows: number
}

export interface ClientsList {
  id: number,
  full_name: string,
  email: string,
}

export interface GetClientsResponse {
  totalPatients: number;
  totalPages: number;
  currentPage: number;
  data: Client[];
  success: boolean;
}

export interface GetClientsListResponse {
  data: ClientsList[];
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
