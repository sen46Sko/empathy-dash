import { IconButton, Modal, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';
import type { ClientSurveys } from '@/types/surveys/survey.types';
import dayjs from 'dayjs';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSurveys } from '@/hooks/use-surveys';
import ErrorIcon from '@mui/icons-material/Error';
import type { CustomThemeType } from '@/styles/theme/types';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import Button from '@mui/material/Button';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';

interface SurveyRowProps {
  row: ClientSurveys,
}

const MuiTableCell = styled(TableCell)`
  color: ${({theme}) => (theme as CustomThemeType).palette.text.secondary as string} !important;
`;

const SurveyRow: React.FC<SurveyRowProps> = ({row}) => {
  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const {
    deleteSurvey,
  } = useSurveys();
  const router = useRouter();
  const rootRef = React.useRef<HTMLDivElement>(null);
  
  const handleDeleteSurvey = async () => {
    deleteSurvey(row.id);
    setOpen(false);
  }
  
  const navigateToEdit = () => {
    router.push(`${paths.dashboard.newSurvey}/${row.id}`);
  }
  
  const navigateToSend = () => {
    router.push(`${paths.dashboard.sendSurvey}?surveyId=${row.id}`);
  }
  
  const toggleModal = () => {
    setDeleteOpen(!isDeleteOpen);
  }
  
  return (
    <React.Fragment>
      {
        isDeleteOpen ? (
          <Box
            ref={rootRef}
            sx={{
              flexGrow: 1,
              minWidth: 300,
              transform: 'translateZ(0)',
              position: 'fixed',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              top: 0,
              zIndex: 10000,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              left: 0,
              bottom: 0,
              right: 0,
              width: '100%',
            }}
          >
            <Modal
              aria-describedby="server-modal-description"
              aria-labelledby="server-modal-title"
              container={() => rootRef.current!}
              disableAutoFocus
              disableEnforceFocus
              disablePortal
              open
              sx={{
                display: 'flex',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={(theme) => ({
                  bgcolor: 'background.paper',
                  minWidth: 320,
                  maxWidth: 420,
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: (theme as CustomThemeType).shadows[2],
                  p: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                })}
              >
                <ErrorIcon sx={{color: 'text.primary', fontSize: '6rem', mb: 2}}/>
                <Typography>
                  Do you want to delete this survey?
                </Typography>
                <Typography>
                  Please confirm, this action cannot be undone
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    mt: 5,
                  }}
                >
                  <Button onClick={toggleModal} color="secondary" variant="outlined">
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteSurvey} color="error" startIcon={<TrashIcon />} variant="contained">
                    Confirm
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        ) : null
      }
      
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <MuiTableCell component="th" scope="row">
          {row.name}
        </MuiTableCell>
        <MuiTableCell align="left">{`${row.send_to} client${row.send_to === 1 ? '' : 's'}`}</MuiTableCell>
        <MuiTableCell align="left">{row.responses}</MuiTableCell>
        <MuiTableCell align="left">{dayjs(new Date(row.created_at)).format('MMMM D, YYYY')}</MuiTableCell>
        <MuiTableCell align="left">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Box
                onClick={navigateToSend}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <SendIcon sx={{color: 'primary.main', fontSize: '1.5rem', mb: 1}}/>
                <Typography sx={{color: 'primary.main', fontSize: '0.8rem'}}>Send</Typography>
              </Box>
              <Box
                onClick={navigateToEdit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <EditIcon sx={{color: 'primary.main', fontSize: '1.5rem', mb: 1}}/>
                <Typography sx={{color: 'primary.main',fontSize: '0.8rem'}}>Edit</Typography>
              </Box>
              <Box
                onClick={toggleModal}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <DeleteIcon sx={{color: 'primary.main', fontSize: '1.5rem', mb: 1}}/>
                <Typography sx={{color: 'primary.main', fontSize: '0.8rem'}}>Delete</Typography>
              </Box>
            </Box>
            <IconButton
              aria-label="expand row"
              onClick={() => { setOpen(!open); }}
              size="small"
            >
              {open ? <KeyboardArrowUpIcon sx={{color: 'primary.main'}}/> : <KeyboardArrowDownIcon sx={{color: 'primary.main'}}/>}
            </IconButton>
          </Box>
        </MuiTableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={6}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          sx={{
            borderBottom: !open ? 'unset' : '1px solid var(--mui-palette-divider) !important',
          }}
        >
          <Collapse in={open} sx={{border: 'none'}} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography>Collapse Data Here</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
};

export default SurveyRow;
