'use client';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import ClientsList from '@/components/clients/clients-list';
import { Pagination } from '@mui/material';
import CustomButton from '@/components/core/custom-button';
import AddIcon from '@mui/icons-material/Add';
import { Option } from '@/components/core/option';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useClients } from '@/hooks/use-clients';
import { getPageRange } from '@/helpers/core.helper';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter, useSearchParams } from 'next/navigation';
import { paths } from '@/paths';
import { MultiSelect } from '@/components/core/multi-select';
import { ClientSortByEnum, type ClientsState } from '@/types/clients/clients.types';

const SORT_VALUES = [
  {
    value: ClientSortByEnum.CreatedAt,
    label: 'Creation Date',
  },
  {
    value: ClientSortByEnum.Name,
    label: 'Name',
  },
  {
    value: ClientSortByEnum.Email,
    label: 'E-mail',
  },
  {
    value: ClientSortByEnum.Birthday,
    label: 'Birthday',
  },
  {
    value: ClientSortByEnum.TherapyType,
    label: 'Therapy Type',
  },
]

const ClientsBlock: React.FC = () => {
  const { totalClients, currentPage, rows, handleDataChange, isLoading, sortBy } = useClients();
  const router = useRouter();
  
  const handleRowsChange = (event: SelectChangeEvent<number>) => {
    handleDataChange('rows', event.target.value as number);
  }
  
  const handlePageChange = (_: unknown, page: number) => {
    handleDataChange('currentPage', page);
  }
  
  const handleSortByChange = (val: string[]) => {
    if (val.length > 1) {
      handleDataChange('sortBy', val[1]);
    }
  }
  
  const navigateToCreate = () => {
    router.push(paths.dashboard.newClient);
  }
  
  return (
    <>
      <Card sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        
        <Box sx={{display: 'flex', px: 3, pt: 3, pb: 2, justifyContent: 'space-between'}}>
          <Box>
            <CardHeader sx={{p: 0, m: 0}} title='Clients'/>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary'
              }}
            >
              <Typography fontSize={14}>Sort by:</Typography>
              <MultiSelect label={(SORT_VALUES.find((item) => item.value === sortBy) as Record<string, string>).label} onChange={handleSortByChange} options={SORT_VALUES} value={[sortBy]} />
            </Box>
          </Box>
          
          <Box display='flex' justifyContent='center'>
            <CustomButton onClick={navigateToCreate} startIcon={<AddIcon/>} text='New client' type="button"/>
          </Box>
        </Box>
        
        <Box sx={{ mx: 3}}>
          <Divider/>
        </Box>
        
        <CardContent sx={{
          flexGrow: 1,
          overflow: "auto",
          position: 'relative',
          px: 3,
          py: 0,
          mr: 1,
          "::-webkit-scrollbar": {
            width: "8px",
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: 'transparent',
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a8a8a8",
          },
        }}>
          <Box
            // sx={{ height: "100%" }}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              "::-webkit-scrollbar": {
                width: "8px",
              },
              "::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "10px",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#a8a8a8",
              },
            }}
          >
            {!isLoading && <ClientsList/>}
          </Box>
          
          {isLoading ? <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
              <CircularProgress />
            </Box> : null}
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              mr: 1,
            }}
          >
            Rows per page:
          </Typography>
          <Select onChange={handleRowsChange} sx={{borderRadius: 2}} value={rows}>
            <Option value={12}>12</Option>
            <Option value={24}>24</Option>
            <Option value={48}>48</Option>
          </Select>
        </Box>
        
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Box>
            <Typography
              sx={{
                color: 'text.secondary',
                mr: 2,
              }}
            >
              {getPageRange(totalClients, currentPage, rows)}
            </Typography>
          </Box>
          <Card
            sx={{
              backgroundColor: 'transparent',
              py: 1,
            }}
          >
            <Pagination
              color="standard"
              count={Math.ceil(totalClients / rows)}
              onChange={handlePageChange}
              page={currentPage}
            />
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default ClientsBlock;
