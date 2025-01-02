'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';
import { useClients } from '@/hooks/use-clients';
import BackButton from '@/components/core/back-button';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Divider from '@mui/material/Divider';
import moment from 'moment';
import dayjs from 'dayjs';
import { paths } from '@/paths';

const ClientDetailsBlock: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { fetchClientById, initClient, isLoading } = useClients();
  const age = useMemo(() => {
    if (initClient) {
      const today = dayjs();
      const birth = dayjs(new Date(initClient.birthday));
      const age = today.diff(birth, 'year');
      const isBirthdayPassedThisYear = today.isAfter(birth.add(age, 'year'));
      const result = isBirthdayPassedThisYear ? age : age - 1;
      
      return result;
    }
    return 0;
  }, [initClient?.id])
  
  useEffect(() => {
    if (initClient?.id !== Number(id) || !initClient) {
      getClient();
    }
  }, []);
  
  const handleGoBack = () => {
    router.back();
  }
  
  const getClient = () => {
    const userId = Number(id as string);
    fetchClientById(userId)
  }
  
  const goToEdit = () => {
    router.push(`${paths.dashboard.newClient}/${id}`)
  }
  
  return (
    <Box>
      <Box
        sx={{
          flexBasis: '50%',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BackButton onClick={handleGoBack}/>
          
          <Button endIcon={<EditIcon/>} disabled={isLoading} onClick={goToEdit}>Edit</Button>
        </Box>
        
      </Box>

      <Card sx={{mt: 3}}>
        <CardContent>
          {isLoading ? <Skeleton style={{height: 23, width: 140}}/> : <Typography sx={{fontSize: 18}}>{initClient?.full_name}</Typography>}
          <Divider sx={{my: 3}}/>
          
          <Box display='flex'>
            <Box flexBasis='47.5%'>
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Age:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 50, margin: 0}}/> : <Typography variant="body1">{age}</Typography>}
              </Box>
              
              <Divider/>
              
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Email:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 160, margin: 0}}/> : <Typography variant="body1">{initClient?.email}</Typography>}
              </Box>
              
              <Divider/>
              
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Birthday:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 140, margin: 0}}/> : <Typography variant="body1">{moment(initClient?.birthday).format('MMMM D, YYYY')}</Typography>}
                
              </Box>
              
              <Divider/>
              
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Therapy Type:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 50, margin: 0}}/> : <Typography variant="body1">{initClient?.therapy_type}</Typography>}
              </Box>
            </Box>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexBasis: '5%'
              }}
            >
              <Divider
                flexItem
                orientation="vertical"
                sx={{ mx: 1, height: 'auto', borderRightWidth: 1}}
              />
            </Box>
          
            <Box  flexBasis='47.5%'>
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Survey Intervals:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 50, margin: 0}}/> : <Typography variant="body1">-</Typography>}
              </Box>
              
              <Divider/>
              
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Survey Responses:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 50, margin: 0}}/> : <Typography variant="body1">{initClient?.SurveyResult?.length}</Typography>}
              </Box>
              
              <Divider/>
              
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Active Since:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 140, margin: 0}}/> : <Typography variant="body1">{moment(initClient?.created_at).format('MMMM D, YYYY')}</Typography>}
              </Box>
              
              <Divider/>
              
              <Box alignItems='center' display='flex' justifyContent='space-between' py={2}>
                <Typography color="text.secondary" variant="body2">Sessions Schedule:</Typography>
                {isLoading ? <Skeleton style={{height: 20, width: 50, margin: 0}}/> : <Typography variant="body1">-</Typography>}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientDetailsBlock;
