'use client';

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { z as zod } from 'zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import CustomButton from '@/components/core/custom-button';
import OtpInput from '@/components/auth/custom/otp-input';
import { toast } from '@/components/core/toaster';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import { authClient } from '@/lib/auth/custom/client';
import Alert from '@mui/material/Alert';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';

const schema = zod.object({ otp: zod.string().min(6, 'x').max(6, '2') });

type Values = zod.infer<typeof schema>;

const defaultValues = { otp: '' } satisfies Values;


const ConfirmRegisterEmail: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [timer, setTimer] = useState(2 * 60);
  const { setUser } = useUser();
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval)
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema), reValidateMode: 'onChange' });

  const otp = useWatch({
    control,
    name: 'otp',
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      
      setIsPending(true);
      const { error, data } = await authClient.confirmEmail(values.otp, axiosPrivate);

      if (error) {
        setError('root', { type: 'server', message: error });
        setValue('otp', '');
        setIsPending(false);
        return;
      }
      if (data) {
        setIsPending(false);
        setUser(data.data);
        router.refresh();
      }
      
    },
    [setError]
  );

  const resendCode = async () => {
    setIsPending(true);
    const { error, data } = await authClient.resendEmailConfirm(axiosPrivate);
    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }
    
    if (data) {
      setIsPending(false)
      setTimer(2 * 60)
      toast.info('Your OTP code has been sent');
    }
  };


  return (
    <Box maxWidth='520px' sx={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center'}}>
      <Typography component='h2' sx={{fontWeight: 700}} textAlign='center' variant='h4'>Verify your account</Typography>
      <Typography color='text.secondary' component='p' mt={2} textAlign='center' variant='subtitle1'>A code has been sent to your email, please enter the code to continue</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box  sx={{display: 'flex', justifyContent: 'center'}}>
          <Stack maxWidth='580px' mt={5} spacing={2} width='100%'>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <FormControl error={Boolean(errors.otp)}>
                  <OtpInput length={6} onChange={field.onChange} value={field.value}/>
                </FormControl>
              )}
            />

            {timer > 0 ? (
              <Box alignItems='center' display='flex' gap={0.3} justifyContent='center'>
                <Typography component='p' textAlign='center' variant='subtitle1'>Resend code in</Typography>
                <Typography color='primary' component='p' fontWeight={700} textAlign='center' variant='subtitle1'>{formatTime(timer)}</Typography>
              </Box>
            ) : (
              <Box display='flex' gap={0.3} justifyContent='center'>
                <Typography sx={{ cursor: 'pointer' }} color='primary' component='p' onClick={resendCode} textAlign='center' variant='subtitle1'>Resend</Typography>
              </Box>
            )}
            
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}


            <Box display='flex' justifyContent='center' mt={5}>
              <Box>
                <CustomButton disabled={isPending || Boolean(otp.length !== 6)} text='Verify code' type="submit"/>
              </Box>
            </Box>
          </Stack>
        </Box>
      </form>
    </Box>
  );
};

export default ConfirmRegisterEmail;
