import { Client, ClientSortByEnum } from '@/types/clients/clients.types';
import { ClientQuestion } from '@/types/surveys/client-survey.types';

export interface SurveyOption {
  value: string,
}

export interface SurveyOptionFormValue extends SurveyOption {
  id: string,
}

export interface SurveyQuestion {
  question: string,
  question_type: QuestionTypeEnum,
  options?: SurveyOption[]
}

export interface SurveyFormValues {
  name: string,
  category_id: number | null,
  questions: SurveyQuestion[],
}

export interface SurveyFormDTO {
  name: string,
  category_id: number,
  questions: {
    question: string,
    question_type: QuestionTypeEnum,
    options?: string[],
  }[],
}

export enum QuestionTypeEnum {
  SELECTION = 'selection',
  YESNO = 'yes_no',
  TEXT = 'text_field'
}

export interface GetSurveysResponse {
  totalSurveys: number;
  totalPages: number;
  currentPage: number;
  data: ClientSurveys[];
  success: boolean;
}

export interface SurveyCategory {
  id: number,
  category: string,
}

export interface GetCategoriesResponse {
  data: {
    id: number,
    category: string,
  }[],
  success: boolean,
}

export interface PostCategoryResponse {
  category: {
    id: number,
    category: string,
  },
}

export interface ClientSurveys {
  id: number,
  name: string,
  send_to: number,
  responses: number,
  created_at: string,
};

export interface RawQuestion {
  question: string,
  question_type: QuestionTypeEnum,
  options?: string[],
}

export interface CurrentSurvey {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  questions: ClientQuestion[];
  created_at: string;
  updated_at: string;
  send_to: number;
  responses: number;
}

export interface GetCurrentSurveyResponse {
  data: CurrentSurvey[],
  success: boolean
}

export interface SurveysState {
  surveys: ClientSurveys[],
  currentPage: number,
  totalSurveys: number,
  sortBy: SurveySortByEnum,
  rows: number
}

export enum SurveySortByEnum {
  Name = 'name',
  Date = 'created_at',
}
