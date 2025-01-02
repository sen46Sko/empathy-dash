import React from 'react';
import { TableContainer } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import SurveyRow from '@/components/dashboard/surveys/survey-row';
import { useSurveys } from '@/hooks/use-surveys';
import styled from '@emotion/styled';
import type { CustomThemeType } from '@/styles/theme/types';

const MuiTableHead = styled(TableHead)`
  th {
    background-color: transparent !important;
    padding-top: 20px;
    padding-bottom: 20px;
    font-weight: 500;
    color: ${({theme}) => (theme as CustomThemeType).palette.text.primary} !important;
  }
`;

const SurveyTable: React.FC = () => {
  const { surveys } = useSurveys();
  
  return (
    <TableContainer sx={{p: 0}}>
      <Table aria-label="collapsible table">
        <MuiTableHead>
          <TableRow>
            <TableCell sx={{width: '30%'}}>Name</TableCell>
            <TableCell sx={{width: '15%'}}>Sent to</TableCell>
            <TableCell sx={{width: '15%'}}>Responses</TableCell>
            <TableCell sx={{width: '20%'}}>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </MuiTableHead>
        <TableBody
          sx={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
        >
    
          {surveys.map((row) => (
            <SurveyRow key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SurveyTable;
