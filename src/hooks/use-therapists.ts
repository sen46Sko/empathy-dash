import * as React from 'react';
import { TherapistsContext, TherapistsContextValue } from '@/contexts/therapists';

export function useTherapists(): TherapistsContextValue {
  const context = React.useContext(TherapistsContext);
  
  if (!context) {
    throw new Error('useTherapists must be used within a Therapist Provider');
  }
  
  return context;
}
