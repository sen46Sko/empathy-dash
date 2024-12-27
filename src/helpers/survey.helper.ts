import type { CurrentSurvey, SurveyFormDTO, SurveyFormValues } from '@/types/surveys/survey.types';
import { QuestionTypeEnum } from '@/types/surveys/survey.types';

export function transformSurveyFormData(data: SurveyFormValues): SurveyFormDTO {
  return {
    name: data.name,
    category_id: data.category_id!,
    questions: data.questions.map((question) => {
      
      if (question.question_type === QuestionTypeEnum.SELECTION) {
        return {
          question: question.question,
          question_type: question.question_type,
          options: (question.options!).map((option) => option.value),
        }
      }
      
      if (question.question_type === QuestionTypeEnum.YESNO) {
        return {
          question: question.question,
          question_type: question.question_type,
        }
      }
      
      if (question.question_type === QuestionTypeEnum.TEXT) {
        return {
          question: question.question,
          question_type: question.question_type,
        }
      }
      
      return {
        question: question.question,
        question_type: question.question_type,
        options: (question.options!).map((option) => option.value),
      }
    }),
  }
}

export function transformSurveyDataToForm(data: CurrentSurvey): SurveyFormValues {
  return {
    name: data.name,
    category_id: data.category_id,
    questions: data.questions.map((question) => {
      if (question.question_type === QuestionTypeEnum.SELECTION) {
        return {
          question: question.question,
          question_type: question.question_type,
          options: (question.options!).map((option) => {
            return {
              value: option,
            }
          }),
        }
      }
      
      if (question.question_type === QuestionTypeEnum.TEXT) {
        return {
          question: question.question,
          question_type: question.question_type,
        }
      }
      
      if (question.question_type === QuestionTypeEnum.YESNO) {
        return {
          question: question.question,
          question_type: question.question_type,
        }
      }
      
      return {
        question: question.question,
        question_type: question.question_type,
        options: (question.options!).map((option) => {
          return {
            value: option,
          }
        }),
      }
    }),
  }
}

const dayMap: Record<string, number> = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6
};

interface SurveySchedule {
  clients: any[];
  sendMode: 'now' | 'schedule';
  frequency: 'specificDays' | 'biweekly' | 'monthly';
  selectedDays: string[];
  date: string;
  time: string;
  notify: boolean;
}

export function convertToCron(data: SurveySchedule): string {
  const timeDate = new Date(data.time);
  const minutes = timeDate.getMinutes();
  const hours = timeDate.getHours();
  
  const startDate = new Date(data.date);
  const startDay = startDate.getDate();
  
  const weekDays = data.selectedDays
    .map(day => dayMap[day])
    .sort((a, b) => a - b);
  
  const startWeek = Math.floor((startDate.getTime() / (7 * 24 * 60 * 60 * 1000)));
  const isEvenStart = startWeek % 2 === 0;
  
  switch (data.frequency) {
    case 'monthly':
      return `${minutes} ${hours} ${startDay} * *`;
    
    case 'specificDays':
      return `${minutes} ${hours} * * ${weekDays.join(',')}`;
    
    case 'biweekly':
      return weekDays
        .map(day => {
          if (isEvenStart) {
            return `${minutes} ${hours} * * ${day}%2`;
          } else {
            return `${minutes} ${hours} * * ${day}%2+1`;
          }
        })
        .join(' || ');
    
    default:
      throw new Error('Invalid frequency');
  }
}
