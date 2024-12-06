'use client';

import type { ClientsState } from '@/types/clients/clients.types';
import React, { createContext, useState, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import { useRouter } from 'next/navigation';
import {
  ClientSurveys,
  SurveyCategory,
  SurveyFormDTO, SurveyFormValues,
  SurveySortByEnum,
  SurveysState
} from '@/types/surveys/survey.types';
import { surveyClient } from '@/lib/surveys/surveys';
import { transformSurveyDataToForm } from '@/helpers/survey.helper';

export interface SurveysContextValue {
  isLoading: boolean;
  error: string | null;
  surveys: ClientSurveys[];
  totalSurveys: number,
  currentPage: number,
  rows: number,
  handleDataChange: (key: keyof ClientsState, value: number | string) => void,
  sortBy : SurveySortByEnum,
  postSurvey: (values: SurveyFormDTO) => void,
  editSurvey: (value: SurveyFormDTO, id: number) => void,
  fetchSurveys: () => void,
  fetchCategories: () => void,
  categories: SurveyCategory[],
  deleteSurvey: (id: number) => void,
  postCategory: (value: string) => void,
  fetchSurveyById: (id: number) =>  void,
  currentSurvey: SurveyFormValues | null,
  isSuccess: boolean,
  sendSurvey: (surveyId: number, clientId: number) => void,
  setSuccess: Dispatch<SetStateAction<boolean>>,
  setSendComplete: Dispatch<SetStateAction<boolean>>,
  isSendComplete: boolean,
}

export const SurveysContext = createContext<SurveysContextValue | undefined>(undefined);

export const SurveysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentData, setData] = useState<SurveysState>({
    surveys: [],
    currentPage: 1,
    totalSurveys: 1,
    sortBy: SurveySortByEnum.Name,
    rows: 12,
  })
  const [categories, setCategories] = useState<SurveyCategory[]>([{id: 0, category: 'Other'}]);
  const [currentSurvey, setCurrentSurvey] = useState<SurveyFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setSuccess] = useState(false);
  const [isSendComplete, setSendComplete] = useState(false);
  const isFirstRender = useRef(true);
  const axiosPrivate = useAxiosPrivate();
  
  const fetchSurveys = async () => {
    setLoading(true);
    const { data, error } = await surveyClient.getSurveys(axiosPrivate, currentData.rows, currentData.currentPage, currentData.sortBy);
    
    if (data) {
      setData((prev) => {
        return {
          ...prev,
          surveys: data.data.data,
          totalSurveys: data.data.totalSurveys,
          currentPage: data.data.currentPage,
        }
      })
    }
    
    setLoading(false);
  }
  
  const sendSurvey = async (surveyId: number, clientId: number) => {
    setLoading(true);
    const { data, error } = await surveyClient.sendSurvey(axiosPrivate, surveyId, clientId);
    if (data) {
      setSendComplete(true);
    }
    
    setLoading(false);
  }
  
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      fetchSurveys().then(() => null).catch(() => null)
    }
  }, [currentData.rows, currentData.currentPage, currentData.sortBy]);
  
  const fetchCategories = async () => {
    const { data: categoriesData, error: categoriesError } = await surveyClient.getSurveyCategories(axiosPrivate);
    if (categoriesData) {
      setCategories(categoriesData.data.data);
    }
  }
  
  const postCategory = async (value: string) => {
    const { data: categoryData, error: categoryError } = await surveyClient.postSurveyCategory(axiosPrivate, value);
    
    
    if (categoryData) {
      setCategories((prev) => [...prev, categoryData.data.category]);
    }
  }
  
  const fetchSurveyById = async (id: number) => {
    setLoading(true);
    const { data, error } = await surveyClient.getSurveyById(axiosPrivate, id);
    
    if (data?.data.data[0]) {
      
      const res = transformSurveyDataToForm(data.data.data[0]);
      setCurrentSurvey(res)
    }
    
    setLoading(false);
  }
  
  const deleteSurvey = async (id: number) => {
    const { data, error: errorData } = await surveyClient.deleteSurvey(axiosPrivate, id);
    
    if (data) {
      setData((prev) => {
        return {
          ...prev,
          surveys: prev.surveys.filter((item) => item.id !== id),
        }
      })
    }
    
    if (errorData) {
      setError(errorData);
    }
    
    setLoading(false);
  }
  
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
  
  const postSurvey = async (values: SurveyFormDTO) => {
    setError(null)
    setLoading(true);
    const { data, error: errorValue } = await surveyClient.postSurvey(axiosPrivate, values);

    if (data) {
      setSuccess(true);
    }

    if (errorValue) {
      setError(errorValue)
    }
    
    setLoading(false);
  }
  
  const editSurvey = async (values: SurveyFormDTO, id: number) => {
    setError(null)
    setLoading(true);
    const { data, error: errorValue } = await surveyClient.editSurvey(axiosPrivate, values, id);
    
    if (data) {
      setSuccess(true);
      
      // setData((prev) => {
      //   return {
      //     ...prev,
      //     prev[surveys]
      //   }
      // })
    }
    
    if (errorValue) {
      setError(errorValue)
    }
    
    setLoading(false);
  }
  
  return (
    <SurveysContext.Provider value={{
      isLoading,
      error,
      postSurvey,
      fetchSurveys,
      handleDataChange,
      deleteSurvey,
      ...currentData,
      fetchCategories,
      postCategory,
      fetchSurveyById,
      editSurvey,
      categories,
      currentSurvey,
      isSuccess,
      setSuccess,
      sendSurvey,
      isSendComplete,
      setSendComplete,
    }}>
      {children}
    </SurveysContext.Provider>
  );
};

