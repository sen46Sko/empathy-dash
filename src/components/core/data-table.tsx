'use client';

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import type { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from '@emotion/styled';
import { Theme } from '@mui/system';
import { CustomThemeType } from '@/styles/theme/types';

export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel;
  formatter?: (row: TRowModel, index: number) => React.ReactNode;
  hideName?: boolean;
  name: string;
  width?: number | string;
}

type RowId = number | string;

export interface DataTableProps<TRowModel> extends Omit<TableProps, 'onClick'> {
  columns: ColumnDef<TRowModel>[];
  hideHead?: boolean;
  hover?: boolean;
  onClick?: (event: React.MouseEvent, row: TRowModel) => void;
  onDeselectAll?: (event: React.ChangeEvent) => void;
  onDeselectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  onSelectAll?: (event: React.ChangeEvent) => void;
  onSelectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  rows: TRowModel[];
  selectable?: boolean;
  selected?: number[];
  uniqueRowId?: (row: TRowModel) => RowId;
  hideSelectAll?: boolean,
}

const MuiTableHead = styled(TableHead)`
  th {
    background-color: transparent !important;
    padding-top: 20px;
    padding-bottom: 20px;
    font-weight: 500;
    color: ${({theme}) => (theme as CustomThemeType).palette.text.primary as string} !important;
  }
`;

export function DataTable<TRowModel extends object & { id?: RowId | null }>({
  columns,
  hideHead,
  hover,
  onClick,
  onDeselectAll,
  onDeselectOne,
  onSelectOne,
  onSelectAll,
  rows,
  selectable,
  hideSelectAll,
  selected,
  ...props
}: DataTableProps<TRowModel>): React.JSX.Element {
  const selectedSome = (selected?.length ?? 0) > 0 && (selected?.length ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.length === rows.length;
  
  return (
    <Table {...props} sx={{boxShadow: 0}}>
      <MuiTableHead sx={{
        ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }),
        backgroundColor: 'transparent',
        boxShadow: 'unset',
      }}>
        <TableRow sx={{backgroundColor: 'transparent'}}>
          {selectable && (hideSelectAll === false || hideSelectAll === undefined) ? (
            <TableCell
              padding="checkbox"
              sx={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}
            >
              <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                onChange={(event) => {
                  if (selectedAll) {
                    onDeselectAll?.(event);
                  } else {
                    onSelectAll?.(event);
                  }
                }}
              />
            </TableCell>
          ) : (
            <TableCell/>
          )}
          {columns.map(
            (column): React.JSX.Element => (
              <TableCell
                key={column.name}
                sx={{
                  width: column.width,
                  minWidth: column.width,
                  maxWidth: column.width,
                  ...(column.align && { textAlign: column.align }),
                  backgroundColor: 'red',
                }}
              >
                {column.hideName ? null : column.name}
              </TableCell>
            )
          )}
        </TableRow>
      </MuiTableHead>
      <TableBody
        sx={{
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }}
      >
        {rows.map((row, index): React.JSX.Element => {
          const rowId = row.id as number;
          const rowSelected = rowId ? selected?.includes(row.id as number) : false;

          return (
            <TableRow
              hover={hover}
              key={rowId ?? index}
              selected={rowSelected}
              {...(onClick && {
                onClick: (event: React.MouseEvent) => {
                  onClick(event, row);
                },
              })}
              sx={{ ...(onClick && { cursor: 'pointer' }) }}
            >
              {selectable ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={rowId ? rowSelected : false}
                    onChange={(event: React.ChangeEvent) => {
                      if (rowSelected) {
                        onDeselectOne?.(event, row);
                      } else {
                        onSelectOne?.(event, row);
                      }
                    }}
                    onClick={(event: React.MouseEvent) => {
                      if (onClick) {
                        event.stopPropagation();
                      }
                    }}
                  />
                </TableCell>
              ) : null}
              {columns.map(
                (column): React.JSX.Element => (
                  <TableCell key={column.name} sx={{ ...(column.align && { textAlign: column.align }) }}>
                    {
                      (column.formatter
                        ? column.formatter(row, index)
                        : column.field
                          ? row[column.field]
                          : null) as React.ReactNode
                    }
                  </TableCell>
                )
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
