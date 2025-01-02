import type { NoteUser, User } from '@/types/user';

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

export interface NoteSignInResponse {
  user_details: NoteUser,
  token: string,
}

export interface CreateProfileResponse {
  message: string,
  data: User
}

export interface ActivateResponse {
  message: string,
}

export interface ConfirmEmailResponse {
  message: string,
  data: User
}
