import * as React from 'react';
import { UserSurveyContext, UserSurveyContextValue } from '@/contexts/user-survey';

export function useUserSurvey(): UserSurveyContextValue {
  const context = React.useContext(UserSurveyContext);
  
  if (!context) {
    throw new Error('useUserSurvey must be used within a SurveysProvider');
  }
  
  return context;
}
