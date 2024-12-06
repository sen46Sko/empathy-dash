import type { User } from '@/types/user';

export interface UserContextValue {
  token: string | null, user: User | null; error: string | null; isLoading: boolean,
  checkSession?: () => Promise<void>;
  setUser: (data: User | null, token?: string | null) => void,
}
