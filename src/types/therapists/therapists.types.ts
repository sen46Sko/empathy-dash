export interface Therapist {
  id: number,
  email: string,
  full_name: string,
  therapy_type: string,
  status: 'active' | 'pending',
  created_at: string,
  notes?: string,
}

export enum TherapistsSortByEnum {
  Name = 'full_name',
  Email = 'email',
  Birthday = 'birthday',
  CreatedAt = 'created_at',
}

export interface CreateTherapistDTO {
  full_name: string;
  email: string;
  role: 'therapist',
  notes: string,
}

export interface GetTherapistsResponse {
  totalTherapists: number;
  totalPages: number;
  currentPage: number;
  data: Therapist[];
  success: boolean;
}

export interface GetTherapistResponse {
  data: Therapist;
  success: boolean;
}

export interface TherapistsState {
  clients: Therapist[],
  currentPage: number,
  totalTherapists: number,
  sortBy: TherapistsSortByEnum,
  rows: number
}
