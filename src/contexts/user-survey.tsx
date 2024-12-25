'use client';
import React, { createContext, useState } from 'react';
import { surveyClient } from '@/lib/surveys/surveys';
import { ClientSurvey, ClientSurveyResponse } from '@/types/surveys/client-survey.types';
import { RawQuestion } from '@/types/surveys/survey.types';

export interface UserSurveyContextValue {
  isLoading: boolean,
  surveyData: ClientSurvey | null,
  fetchSurvey: (id: string) => void,
  postSurveyResponse: (questions: RawQuestion[], answers: string[], id: string) => void,
  isSurveyComplete: boolean,
  isSurveySendLoading: boolean,
  error: string,
}

export const UserSurveyContext = createContext<UserSurveyContextValue | undefined>(undefined);

export const UserSurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSurveySendLoading, setSurveySendLoading] = useState(false);
  const [isSurveyComplete, setSurveyComplete] = useState(false);
  const [surveyData, setSurveyData] = useState<ClientSurvey | null>(null);
  const [error, setError] = useState('');
  
  const fetchSurvey = async (id: string) => {
    setLoading(true);
    const { data, error: errorResult } = await surveyClient.getUserSurveyById(id);

    if (data) {
      setSurveyData(data.data);
    }

    if (errorResult) {
      setError(errorResult);
    }
    
    setLoading(false);
  }
  
  const postSurveyResponse = async (questions: RawQuestion[], answers: string[], id: string) => {
    const formattedData: ClientSurveyResponse = {
      uuid: id,
      answers: questions.map((item, index) => {
        return {
          question: item,
          answer: answers[index],
        }
      })
    }
    setSurveySendLoading(true);
    const { data, error: errorResult } = await surveyClient.postClientResponse(formattedData);
    
    if (data) {
      setSurveyComplete(true);
    }
    
    if (errorResult) {
      setError(errorResult);
    }
    
    setSurveySendLoading(false);
  }
  
  return (
    <UserSurveyContext.Provider value={{
      isLoading,
      surveyData,
      fetchSurvey,
      postSurveyResponse,
      isSurveySendLoading,
      isSurveyComplete,
      error,
    }}>
      {children}
    </UserSurveyContext.Provider>
  );
};
