import * as React from 'react';
import type { ClientContextValue} from '@/contexts/clients';
import { ClientsContext } from '@/contexts/clients';

export function useClients(): ClientContextValue {
  const context = React.useContext(ClientsContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}
