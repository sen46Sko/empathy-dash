'use client';
import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TERMS } from '@/constants/auth/auth.constants';
import CustomButton from '@/components/core/custom-button';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import { authClient } from '@/lib/auth/custom/client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';

const TermsTemplate: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();

  const handleDeny = () => {
    setUser(null);
    router.replace(paths.auth.custom.signIn);
  };
  
  const handleAccept = useCallback(
    async (): Promise<void> => {

    setIsPending(true);
    const { error, data } = await authClient.confirmTermsConditions(axiosPrivate);
      if (error) {
        setIsPending(false);
      } else if (data) {
        const prevUser = user!;
        const userObj = {
          ...prevUser,
          terms_conditions_accepted: true,
        }
        
        setUser(userObj);
        setIsPending(false);
        router.refresh();
      }
    },
    [router]
  );

  return (
    <Box maxWidth='790px' sx={{margin: '0 auto'}}>
      <Typography component='h2' pt={5} sx={{fontWeight: 700}} textAlign='center' variant='h4'>Terms & Condition</Typography>
      <Box mx={1}>
        {TERMS.map((item, index) => {
          return (
            <Typography color='text.secondary' component='p' key={index} mt={5} variant='subtitle1'>{item}</Typography>
          )
        })}
      </Box>
      <Stack alignItems='center' flexDirection='row' justifyContent='center' pb={5} spacing={2}>
        <Box display='flex' justifyContent='center' mt={8}>
          <Box maxWidth='120px' width='100%'>
            <Button
              disabled={isPending}
              onClick={handleDeny}
              sx={{
              border: '1px solid #909090',
              color: '#909090',
              height: '40px',
              fontWeight: 500,
              lineHeight: '1rem',
              fontSize: '1rem',
              display: 'block',
              py: '6px',
              px: '22px',
              '&:hover': {
                border: '1px solid #434A6080',
              }
            }}
              variant='outlined'
            >
              Deny
            </Button>
          </Box>
        </Box>
        <Box display='flex' justifyContent='center' mt={8}>
          <Box maxWidth='120px' width='100%'>
            <CustomButton disabled={isPending} onClick={handleAccept} text='Accept'/>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default TermsTemplate;
