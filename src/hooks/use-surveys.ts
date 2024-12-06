import * as React from 'react';
import { SurveysContext, SurveysContextValue } from '@/contexts/surveys';

export function useSurveys(): SurveysContextValue {
  const context = React.useContext(SurveysContext);
  
  if (!context) {
    throw new Error('useClients must be used within a SurveysProvider');
  }
  
  return context;
}
