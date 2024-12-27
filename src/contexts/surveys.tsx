'use client';

import type { ClientsState } from '@/types/clients/clients.types';
import React, { createContext, useState, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import {
  ClientSurveys, GetSurveyDetailsResponse, SendScheduleDTO,
  SurveyCategory,
  SurveyFormDTO, SurveyFormValues,
  SurveySortByEnum,
  SurveysState
} from '@/types/surveys/survey.types';
import { surveyClient } from '@/lib/surveys/surveys';
import { transformSurveyDataToForm } from '@/helpers/survey.helper';
import { getNotification } from '@/helpers/toast.helper';
import { NotificationTypeEnum } from '@/types/notification';

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
  fetchSurveyDetailsById: (id: number) => void,
  categories: SurveyCategory[],
  deleteSurvey: (id: number) => void,
  postCategory: (value: string) => void,
  fetchSurveyById: (id: number) =>  void,
  currentSurvey: SurveyFormValues | null,
  isMinorLoading: boolean,
  isSuccess: boolean,
  isSendComplete: boolean,
  setSendComplete: Dispatch<SetStateAction<boolean>>,
  sendSurvey: (surveyId: number, clientIds: number[], notification?: boolean) => void,
  setSuccess: Dispatch<SetStateAction<boolean>>,
  surveyDetails: GetSurveyDetailsResponse['data'] | null,
  sendScheduleSurvey: (values: SendScheduleDTO) => void,
}

export const SurveysContext = createContext<SurveysContextValue | undefined>(undefined);

export const SurveysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isMinorLoading, setMinorLoading] = useState(false);
  const [currentData, setData] = useState<SurveysState>({
    surveys: [],
    currentPage: 1,
    totalSurveys: 1,
    sortBy: SurveySortByEnum.Name,
    rows: 12,
  })
  const [categories, setCategories] = useState<SurveyCategory[]>([{id: 0, category: 'Other'}]);
  const [currentSurvey, setCurrentSurvey] = useState<SurveyFormValues | null>(null);
  const [surveyDetails, setSurveyDetails] = useState<GetSurveyDetailsResponse['data'] | null>(null)
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
  
  const fetchSurveyDetailsById = async (id: number) => {
    setLoading(true);
    const { data, error: detailsError } = await surveyClient.getSurveyDetails(axiosPrivate, id);
    
    if (data) {
      setSurveyDetails(data.data)
    }
    
    if (detailsError) {
      setError(detailsError);
      getNotification(detailsError, NotificationTypeEnum.Error)
    }
    
    setLoading(false);
  };
  
  const sendSurvey = async (surveyId: number, clientIds: number[], notification = false) => {
    setLoading(true);
    setMinorLoading(true);
    const { data, error: errorValue } = await surveyClient.sendSurvey(axiosPrivate, surveyId, clientIds);
    
    if (data) {
      setSendComplete(true);
      setSuccess(true);
      
      if (notification) {
        getNotification('Survey send successfully!')
      }
      
    }
    
    if (errorValue) {
      getNotification(errorValue, NotificationTypeEnum.Error)
    }
    setMinorLoading(false);
    setLoading(false);
  }
  
  const sendScheduleSurvey = async (values: SendScheduleDTO) => {
    setLoading(true);
    const { data, error: errorValue } = await surveyClient.sendScheduleSurvey(axiosPrivate, values);
    
    if (data) {
      getNotification('Survey send successfully!')
    }
    
    if (errorValue) {
      getNotification(errorValue, NotificationTypeEnum.Error)
    }
    setMinorLoading(false);
    setLoading(false);
  }
  
  useEffect(() => {
    fetchSurveys().then(() => null).catch(() => null)
  }, [currentData.rows, currentData.currentPage, currentData.sortBy]);
  
  const fetchCategories = async () => {
    const { data: categoriesData, error: categoriesError } = await surveyClient.getSurveyCategories(axiosPrivate);
    if (categoriesData) {
      setCategories(categoriesData.data.data);
    }
  }
  
  const postCategory = async (value: string) => {
    setMinorLoading(true);
    const { data: categoryData, error: categoryError } = await surveyClient.postSurveyCategory(axiosPrivate, value);
    
    
    if (categoryData) {
      setCategories((prev) => [...prev, categoryData.data.category]);
    }
    
    if (categoryError) {
      setError(categoryError);
      getNotification(categoryError, NotificationTypeEnum.Error)
    }
    
    setMinorLoading(false);
  }
  
  const fetchSurveyById = async (id: number) => {
    setLoading(true);
    const { data, error: errorData } = await surveyClient.getSurveyById(axiosPrivate, id);
    
    if (data?.data.data[0]) {
      
      const res = transformSurveyDataToForm(data.data.data[0]);
      setCurrentSurvey(res)
    }
    
    if (errorData) {
      getNotification(errorData, NotificationTypeEnum.Error)
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
      getNotification(errorData, NotificationTypeEnum.Error)
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
    setMinorLoading(true);
    const { data, error: errorValue } = await surveyClient.postSurvey(axiosPrivate, values);

    if (data) {
      setSuccess(true);
    }
    
    if (errorValue) {
      setError(errorValue);
      getNotification(errorValue, NotificationTypeEnum.Error)
    }
    
    setLoading(false);
    setMinorLoading(false);
  }
  
  const editSurvey = async (values: SurveyFormDTO, id: number) => {
    setError(null)
    setLoading(true);
    setMinorLoading(true);
    const { data, error: errorValue } = await surveyClient.editSurvey(axiosPrivate, values, id);
    
    if (data) {
      setSuccess(true);
    }
    
    if (errorValue) {
      setError(errorValue);
      getNotification(errorValue, NotificationTypeEnum.Error)
    }
    
    setMinorLoading(false);
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
      isSendComplete,
      ...currentData,
      fetchCategories,
      fetchSurveyDetailsById,
      postCategory,
      surveyDetails,
      fetchSurveyById,
      editSurvey,
      categories,
      currentSurvey,
      isSuccess,
      setSuccess,
      sendSurvey,
      setSendComplete,
      isMinorLoading,
      sendScheduleSurvey,
    }}>
      {children}
    </SurveysContext.Provider>
  );
};

