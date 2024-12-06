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

const ClientsList: React.FC = () => {
  const { clients } = useClients();
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();
  
  const handleSelect = (_: unknown, row: Client) => {
    setSelected((prev) => {
      return [...prev, row.id]
    })
  }
  
  const handleDeselct = (_: unknown, row: Client) => {
    setSelected((prev) => {
      return prev.filter((item) => item !== row.id)
    })
  }
  
  const handleDeselectAll = () => {
    setSelected([]);
  }
  
  const handleSelectAll = () => {
    const ids = [...selected];
    clients.forEach((item) => {
      if (!ids.includes(item.id)) {
        ids.push(item.id)
      }
    })
    
    setSelected(ids);
  }
  
  const handleClickRow = (_: unknown, row: Client) => {
    router.push(`${paths.dashboard.newClient}/${row.id}`);
  }
  
  return (
    <DataTable<Client>
      columns={columns}
      onClick={handleClickRow}
      onDeselectAll={handleDeselectAll}
      onDeselectOne={handleDeselct}
      onSelectAll={handleSelectAll}
      onSelectOne={handleSelect}
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

export default ClientsList;
