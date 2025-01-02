'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import type { ColumnDef} from '@/components/core/data-table';
import { DataTable } from '@/components/core/data-table';
import type { Client } from '@/types/clients/clients.types';
import { useRouter } from 'next/navigation';
import { useTherapists } from '@/hooks/use-therapists';
import { Therapist } from '@/types/therapists/therapists.types';
import moment from 'moment';
import { Box } from '@mui/system';
import { paths } from '@/paths';

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Typography color="text.secondary" variant="body2">
        {row.full_name}
      </Typography>
    ),
    name: 'Name',
    width: '30%',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography color="text.secondary" variant="body2">
        {moment(row.created_at).format('DD MMM, YYYY')}
      </Typography>
    ),
    name: 'Created',
    width: '15%',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography color="text.secondary" variant="body2">
        {row.email}
      </Typography>
    ),
    name: 'Email',
    width: '35%',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Box
        sx={{
          backgroundColor: row.status === 'active' ? 'success.main' : 'warning.main',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: 1,
        }}
      >
        <Typography color="info.contrastText" variant="body2">
          {row.status}
        </Typography>
      </Box>
    ),
    name: 'Status',
    width: '20%',
    align: 'center',
  },
] satisfies ColumnDef<Therapist>[];

const TherapistsList: React.FC = () => {
  const { therapists } = useTherapists();
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();
  
  const handleSelect = (_: unknown, row: Therapist) => {
    setSelected((prev) => {
      return [...prev, row.id]
    })
  }
  
  const handleDeselct = (_: unknown, row: Therapist) => {
    setSelected((prev) => {
      return prev.filter((item) => item !== row.id)
    })
  }
  
  const handleDeselectAll = () => {
    setSelected([]);
  }
  
  const handleSelectAll = () => {
    const ids = [...selected];
    therapists.forEach((item) => {
      if (!ids.includes(item.id)) {
        ids.push(item.id)
      }
    })
    
    setSelected(ids);
  }
  
  const handleClickRow = (_: unknown, row: Therapist) => {
    router.push(`${paths.dashboard.newTherapists}/${row.id}`);
  }
  
  return (
    <DataTable<Therapist>
      columns={columns}
      onClick={handleClickRow}
      onDeselectAll={handleDeselectAll}
      onDeselectOne={handleDeselct}
      onSelectAll={handleSelectAll}
      onSelectOne={handleSelect}
      rows={therapists}
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

export default TherapistsList;
