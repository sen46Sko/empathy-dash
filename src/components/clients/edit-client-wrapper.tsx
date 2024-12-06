'use client';

import React, { useEffect } from 'react';
import { useClients } from '@/hooks/use-clients';
import { useParams } from 'next/navigation';
import CreateClientForm from '@/components/clients/create-client-form';

const EditClientWrapper: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const { fetchClientById, initClient } = useClients();

  useEffect(() => {
    getClient();
  }, [])
  
  const getClient = () => {
    const userId = Number(id as string);
     fetchClientById(userId)
  }
  
  
  return (
    <>
      {initClient ? <CreateClientForm/> : null}
    </>
  );
};

export default EditClientWrapper;
