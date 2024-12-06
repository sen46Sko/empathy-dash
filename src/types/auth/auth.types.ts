import type { User } from '@/types/user';

export enum ResetStageEnum {
  Email = 'Email',
  Confirm = 'Confirm',
  Password = 'Password',
  Complete = 'Complete',
}

export enum SignUpStageEnum {
  Account = 'Account',
  Confirm = 'Confirm',
}

export enum CreateProfileEnum {
  Terms = 'Terms',
  Profile = 'Profile',
  Complete = 'Complete',
}

export interface SignInResponse {
  message: string,
  data: User,
  jwt: string;
}

export interface CreateProfileResponse {
  message: string,
  data: User
}

export interface ConfirmEmailResponse {
  message: string,
  data: User
}
