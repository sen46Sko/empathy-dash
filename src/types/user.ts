export interface User {
  id: string;
  full_name: null | string;
  avatar?: string | null;
  email?: string;
  [key: string]: unknown;
}
