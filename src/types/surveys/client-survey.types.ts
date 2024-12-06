import type { QuestionTypeEnum } from '@/types/surveys/survey.types';

export interface ClientQuestion {
  question: string;
  question_type: QuestionTypeEnum;
  options?: string[];
}

export interface ClientSurvey {
  id: number;
  name: string;
  category_id: number;
  questions: ClientQuestion[];
  created_at: string;
  updated_at: string;
  SurveyInvite: [
    {
      status: 'complete' | 'pending';
    }
  ]
}

export interface GetClientSurveyResponse {
  data: ClientSurvey,
  success: boolean;
}

interface Answer {
  question: ClientQuestion;
  answer: string;
}

export interface ClientSurveyResponse  {
  uuid: string;
  answers: Answer[];
};
