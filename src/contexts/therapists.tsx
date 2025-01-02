'use client';

import { Client, ClientsList, ClientsState, CreateClientDTO , ClientSortByEnum } from '@/types/clients/clients.types';
import type { SetStateAction, Dispatch } from 'react';
import React, { createContext, useState, useEffect, useRef } from 'react';
import { clientClient } from '@/lib/clients/clients';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import { useRouter } from 'next/navigation';
import { CreateTherapistDTO, Therapist, TherapistsState } from '@/types/therapists/therapists.types';
import { TherapistsSortByEnum } from '@/types/therapists/therapists.types';
import { therapistsClient } from '@/lib/therapists/therapists';
import { getNotification } from '@/helpers/toast.helper';

export interface TherapistsContextValue {
  isLoading: boolean;
  error: string | null;
  therapists: Therapist[];
  totalTherapists: number,
  currentPage: number,
  rows: number,
  setData: Dispatch<SetStateAction<TherapistsState>>,
  sortBy: TherapistsSortByEnum,
  setError: Dispatch<SetStateAction<null | string>>,
  isMinorLoading: boolean,
  handleDataChange: (key: keyof TherapistsState, value: number | string) => void,
  fetchTherapists: () => void,
  fetchTherapistById: (id: number) => void,
  postTherapist: (values: CreateTherapistDTO) => void,
  editTherapist: (values: CreateTherapistDTO, id: number) => void,
  initTherapist: Therapist | null,
  setInitTherapist: Dispatch<SetStateAction<null | Therapist>>,
}

export const TherapistsContext = createContext<TherapistsContextValue | undefined>(undefined);

export const TherapistsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentData, setData] = useState<TherapistsState>({
    clients: [],
    currentPage: 1,
    totalTherapists: 1,
    sortBy: TherapistsSortByEnum.CreatedAt,
    rows: 12,
  });
  const [initTherapist, setInitTherapist] = useState<Therapist | null>(null);
  const [isMinorLoading, setMinorLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  
  const fetchTherapists = async () => {
    setLoading(true);
    const { data, error } = await therapistsClient.getTherapists(axiosPrivate, currentData.rows, currentData.currentPage, currentData.sortBy);
    if (data) {
      setData((prev) => {
        return {
          ...prev,
          clients: data.data.data,
          totalTherapists: data.data.totalTherapists,
          currentPage: data.data.currentPage,
        }
      })
    }
    
    setLoading(false);
  }
  
  const handleDataChange = (key: keyof TherapistsState, value: number | string) => {
    setData((prev) => {
      const data = {
        ...prev,
        [key]: value,
      }
      
      if (key === 'rows') {
        data.currentPage = 1;
      }
      
      return data;
    })
  }
  
  const fetchTherapistById = async (id: number) => {
    setLoading(true);
    const { data, error } = await therapistsClient.getTherapistById(axiosPrivate, id);
    if (data) {
      setInitTherapist(data.data);
    }
    
    setLoading(false);
  }
  
  const postTherapist = async (values: CreateTherapistDTO) => {
    setError(null)
    setLoading(true);
    const { data, error: errorValue } = await therapistsClient.postTherapist(axiosPrivate, values);
    
    if (data) {
      router.back();
      getNotification('Therapist created successfully!')
      fetchTherapists();
    }
    
    if (errorValue) {
      setError(errorValue)
    }
    
    setLoading(false);
  }
  
  const editTherapist = async (values: CreateTherapistDTO, id: number) => {
    setError(null)
    setLoading(true);
    const { data, error: errorValue } = await therapistsClient.editTherapist(axiosPrivate, values, id);
    
    if (data) {
      router.back();
      getNotification('Therapist updated successfully!')
      fetchTherapists();
    }
    
    if (errorValue) {
      setError(errorValue)
    }
    
    setLoading(false);
  }

  useEffect(() => {
    fetchTherapists().then(() => null).catch(() => null)
  }, [currentData.rows, currentData.currentPage, currentData.sortBy]);

  
  return (
    <TherapistsContext.Provider value={{
      isLoading,
      error,
      therapists: currentData.clients,
      fetchTherapists,
      totalTherapists: currentData.totalTherapists,
      currentPage: currentData.currentPage,
      rows: currentData.rows,
      sortBy: currentData.sortBy,
      isMinorLoading,
      postTherapist,
      handleDataChange,
      setError,
      setInitTherapist,
      fetchTherapistById,
      initTherapist,
      editTherapist,
      setData,
    }}>
      {children}
    </TherapistsContext.Provider>
  );
};

