'use client';

import type { User } from '@/types/user';
import { apiService, notesApiService } from '@/api/api.service';
import { AuthRoutes } from '@/api/routes/routes';
import type { AxiosInstance } from 'axios';
import type { ErrorResponse } from '@/types/core/core.types';
import type { ConfirmEmailResponse, CreateProfileResponse, SignInResponse } from '@/types/auth/auth.types';

const user = {
  id: 'USR-000',
  full_name: 'Test Test',
  email: 'test@gmail.com',
  avatar: null,
};

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface CreateProviderProfileParams {
  "telphone": string,
  "organization": string,
  "role": 'manager' | 'supervisor' | 'clinician' | 'other' | 'none'
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(values: SignUpParams, isPatient = false): Promise<{ data?: SignInResponse; error?: string }> {
    try {
      await apiService.post(AuthRoutes.SignUp, {
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        user_type: isPatient ? 'patient' : 'clinician',
      });

      const { error, data } = await this.signInWithPassword({password: values.password, email: values.email});

      if (error) {
        return {error};
      }
      return {
        data
      }
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }

  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ data?: SignInResponse; error?: string }> {
    try {
      const response: SignInResponse = await apiService.post(AuthRoutes.SignIn, params);
      return { data: response };
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }

      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async notesSignIn(params: SignInWithPasswordParams): Promise<{ data?: SignInResponse; error?: string }> {
    try {
      const response: SignInResponse = await notesApiService.post(AuthRoutes.NotesSignIn, params);
      return { data: response };
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async completeProfile(params: CreateProviderProfileParams, axios: AxiosInstance): Promise<{ data?: CreateProfileResponse; error?: string }> {
    try {
      const response: { data: CreateProfileResponse } = await axios.post(AuthRoutes.CreateProfile, params);
      return { data: response.data };
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async confirmEmail(otp: string, axios: AxiosInstance): Promise<{ data?: ConfirmEmailResponse; error?: string }> {
    try {
      const response: { data: ConfirmEmailResponse } = await axios.post(AuthRoutes.ConfirmEmail, {
        code: otp,
      });
      
      return { data: response.data };
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  };
  
  async resendEmailConfirm(axios: AxiosInstance) {
    try {
      const response = await axios.post(AuthRoutes.ResendConfirmEmail);
      return { data: response };
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }
  
  async confirmTermsConditions(axios: AxiosInstance) {
    try {
      const response = await axios.post(AuthRoutes.ConfirmTermsConditions);
      return { data: response };
    } catch (error: unknown) {
      if (error instanceof Error && (error as ErrorResponse).response?.data?.message) {
        return { error: ((error as ErrorResponse).response?.data?.message) };
      }
      
      return {
        error: 'An unknown error occurred'
      }
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
