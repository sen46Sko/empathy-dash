'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTherapists } from '@/hooks/use-therapists';
import CreateTherapistForm from '@/components/dashboard/therapists/create-therapist-form';

const EditTherapistWrapper: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const { initTherapist, fetchTherapistById } = useTherapists();
  
  useEffect(() => {
    if (initTherapist?.id !== Number(id) || !initTherapist) {
      getClient();
    }
  }, []);
  
  const getClient = () => {
    const userId = Number(id as string);
    fetchTherapistById(userId)
  }
  
  
  return (
    <>
      {initTherapist ? <CreateTherapistForm/> : null}
    </>
  );
};

export default EditTherapistWrapper;
