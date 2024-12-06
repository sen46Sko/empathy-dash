import { CurrentSurvey, QuestionTypeEnum, SurveyFormDTO, SurveyFormValues } from '@/types/surveys/survey.types';

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
