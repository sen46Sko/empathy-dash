import type { AxiosInstance } from 'axios';
import { SurveyRoutes } from '@/api/routes/routes';
import type { ErrorResponse } from '@/types/core/core.types';
import { SendScheduleDTO, SurveySortByEnum } from '@/types/surveys/survey.types';
import type {
  GetCategoriesResponse, GetCurrentSurveyResponse, GetSurveyDetailsResponse,
  GetSurveysResponse,
  PostCategoryResponse,
  SurveyFormDTO
 } from '@/types/surveys/survey.types';
import { axiosPublic } from '@/api/api';
import type { ClientSurveyResponse, GetClientSurveyResponse } from '@/types/surveys/client-survey.types';

export class SurveyClient {
  
  async getSurveys(axios: AxiosInstance, rows = 12, page = 1, sortBy = SurveySortByEnum.Name) {
    try {
      const response = await axios.get<GetSurveysResponse>(`${SurveyRoutes.GetSurveys}?rows=${rows}&page=${page}&sortBy=${sortBy}&orderBy=asc`);
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
  
  async getSurveyDetails(axios: AxiosInstance, surveyId: number) {
    try {
      const response = await axios.get<GetSurveyDetailsResponse>(`${SurveyRoutes.GetSurveysDetails}/${surveyId}`);
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
  
  async sendSurvey(axios: AxiosInstance, surveyId: number, clientIds: number[]) {
    try {
      const response = await axios.post<GetSurveysResponse>(SurveyRoutes.SendSurvey, {
        patient_ids: clientIds,
        survey_id: surveyId,
      });
      
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
  
  async sendScheduleSurvey(axios: AxiosInstance, data: SendScheduleDTO) {
    try {
      const response = await axios.post<GetSurveysResponse>(SurveyRoutes.SendScheduleSurvey, data);
      
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
  
  async getSurveyCategories(axios: AxiosInstance) {
    try {
      const response = await axios.get<GetCategoriesResponse>(SurveyRoutes.GetCategories);

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
  
  async postSurveyCategory(axios: AxiosInstance, value: string) {
    try {
      const response = await axios.post<PostCategoryResponse>(SurveyRoutes.PostCategory, { category: value });
      
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
  
  async getSurveyById(axios: AxiosInstance, id: number) {
    try {
      const response = await axios.get<GetCurrentSurveyResponse>(`${SurveyRoutes.GetSurveys}/${id}`);
      
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
  
  async getUserSurveyById(id: string) {
    try {
      const response = await axiosPublic.get<GetClientSurveyResponse>(`${SurveyRoutes.GetSurvey}/${id}`);
      
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
  
  async deleteSurvey(axios: AxiosInstance, id: number) {
    try {
      const response = await axios.delete(`${SurveyRoutes.DeleteSurvey}/${id}`);
      
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
  
  async postSurvey(axios: AxiosInstance, values: SurveyFormDTO) {
    try {
      const response = await axios.post(SurveyRoutes.PostSurvey, values);
      
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
  
  async editSurvey(axios: AxiosInstance, values: SurveyFormDTO, id: number) {
    try {
      const response = await axios.put(`${SurveyRoutes.EditSurvey}/${id}`, values);
      
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
  
  async postClientResponse(result: ClientSurveyResponse) {
    try {
      const response = await axiosPublic.post(SurveyRoutes.PostClientResponse, result);
      
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
}

export const surveyClient = new SurveyClient();
