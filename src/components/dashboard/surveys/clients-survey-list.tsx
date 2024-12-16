'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import type { ColumnDef} from '@/components/core/data-table';
import { DataTable } from '@/components/core/data-table';
import type { Client } from '@/types/clients/clients.types';
import { useClients } from '@/hooks/use-clients';
import dayjs from 'dayjs';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Typography color="text.secondary" variant="body2">
        {row.full_name}
      </Typography>
    ),
    name: 'Name',
    width: '25%',
  },
  {
    formatter: (row): React.JSX.Element => {
      const today = dayjs();
      const birth = dayjs(new Date(row.birthday));
      const age = today.diff(birth, 'year');
      const isBirthdayPassedThisYear = today.isAfter(birth.add(age, 'year'));
      const result = isBirthdayPassedThisYear ? age : age - 1;
      
      return ( <Typography color="text.secondary" variant="body2">
        {result}
      </Typography> )
    },
    name: 'Age',
    width: '20%',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography color="text.secondary" variant="body2">
        {row.email}
      </Typography>
    ),
    name: 'Email',
    width: '30%',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography color="text.secondary" variant="body2">
        {row.therapy_type}
      </Typography>
    ),
    name: 'Therapy Type',
  },
] satisfies ColumnDef<Client>[];

interface ClientsSurveyListProps {
  handleSelect: (_: unknown, row: Client) => void,
  handleDeselect: (_: unknown, row: Client) => void,
  handleSelectAll: () => void,
  handleDeselectAll: () => void,
  selected: number[],
}

const ClientsSurveyList: React.FC<ClientsSurveyListProps> = ({ handleDeselect, handleSelect, selected, handleSelectAll, handleDeselectAll }) => {
  const { clients } = useClients();
  const router = useRouter();

  return (
    <DataTable<Client>
      columns={columns}
      onSelectOne={handleSelect}
      onSelectAll={handleSelectAll}
      onDeselectAll={handleDeselectAll}
      onDeselectOne={handleDeselect}
      rows={clients}
      selectable
      selected={selected}
      sx={{
        p: 0,
        boxShadow: 'unset',
        '& .MuiTableCell-root': {
          backgroundColor: 'red !important',
        },
      }}
    />
  );
};

export default ClientsSurveyList;
