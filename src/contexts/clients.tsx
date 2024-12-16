'use client';

import type { Client, ClientsState, CreateClientDTO } from '@/types/clients/clients.types';
import { ClientSortByEnum } from '@/types/clients/clients.types';
import React, { createContext, useState, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import { clientClient } from '@/lib/clients/clients';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import { useRouter } from 'next/navigation';

export interface ClientContextValue {
  isLoading: boolean;
  error: string | null;
  clients: Client[];
  totalClients: number,
  currentPage: number,
  rows: number,
  setData: Dispatch<SetStateAction<ClientsState>>,
  fetchClients: () => void,
  handleDataChange: (key: keyof ClientsState, value: number | string) => void,
  postClient: (values: CreateClientDTO) => void,
  editClient: (id: number, value: CreateClientDTO) => void,
  sortBy: ClientSortByEnum,
  isMinorLoading: boolean,
  fetchClientById: (id: number) => void,
  initClient: Client | null,
}

export const ClientsContext = createContext<ClientContextValue | undefined>(undefined);

export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentData, setData] = useState<ClientsState>({
    clients: [],
    currentPage: 1,
    totalClients: 1,
    sortBy: ClientSortByEnum.CreatedAt,
    rows: 12,
  });
  const [isMinorLoading, setMinorLoading] = useState(false);
  const [initClient, setInitClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  
  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await clientClient.getClients(axiosPrivate, currentData.rows, currentData.currentPage, currentData.sortBy);
    if (data) {
      setData((prev) => {
        return {
          ...prev,
          clients: data.data.data,
          totalClients: data.data.totalPatients,
          currentPage: data.data.currentPage,
        }
      })
    }
    
    setLoading(false);
  }
  
  const fetchClientById = async (id: number) => {
    setLoading(true);
    const { data, error } = await clientClient.getClientById(axiosPrivate, id);
    if (data) {
      setInitClient(data.data);
    }
    
    setLoading(false);
  }
  
  const postClient = async (values: CreateClientDTO) => {
    setError(null)
    setLoading(true);
    const { data, error: errorValue } = await clientClient.postClient(axiosPrivate, values);
    
    if (data) {
      router.back();
      fetchClients();
    }
    
    if (errorValue) {
      setError(errorValue)
    }
    
    setLoading(false);
  }
  
  const editClient = async (id: number, values: CreateClientDTO) => {
    setError(null);
    setLoading(true);
    const { data, error: errorValue } = await clientClient.editClient(axiosPrivate, id, values);
    
    if (data) {
      router.back();
      
      const editedClient = data.data.data;
      setData((prev) => {
        return {
          ...prev,
          clients: prev.clients.map((item) => {
            if (item.id === editedClient.id) {
              return editedClient;
            }
            
            return item;
          })
        }
      })
      
      setInitClient(null);
    }
    
    if (errorValue) {
      setError(errorValue)
    }
    
    setLoading(false);
  }
  
  useEffect(() => {
    fetchClients().then(() => null).catch(() => null)
  }, [currentData.rows, currentData.currentPage, currentData.sortBy]);
  
  const handleDataChange = (key: keyof ClientsState, value: number | string) => {
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
  
  return (
    <ClientsContext.Provider value={{
      isLoading,
      error,
      clients: currentData.clients,
      fetchClients,
      totalClients: currentData.totalClients,
      currentPage: currentData.currentPage,
      rows: currentData.rows,
      sortBy: currentData.sortBy,
      handleDataChange,
      postClient,
      editClient,
      isMinorLoading,
      fetchClientById,
      initClient,
      setData,
    }}>
      {children}
    </ClientsContext.Provider>
  );
};

