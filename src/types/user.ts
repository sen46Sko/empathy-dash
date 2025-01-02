export interface User {
  id: string;
  full_name: null | string;
  avatar?: string | null;
  status?: 'pending' | 'active';
  email?: string;
  [key: string]: unknown;
}

export interface NoteUser {
  "id": number,
  "uuid": string,
  "name": string,
  "email": string,
}
