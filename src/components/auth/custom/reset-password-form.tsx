'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import CustomButton from '@/components/core/custom-button';
import { FilledInput, OutlinedInput } from '@mui/material';
import { authClient } from '@/lib/auth/custom/client';

const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' } satisfies Values;

interface ResetPasswordProps {
  handleNextStage: () => void,
}

export const ResetPasswordForm: React.FC<ResetPasswordProps> = ({handleNextStage}) => {

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {

      setIsPending(true);

      const { error } = await authClient.resetPassword(values);
      //
      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      setIsPending(false);
      handleNextStage();

      // Redirect to confirm password reset
    },
    [setError]
  );

  return (
    <Box maxWidth='520px'>
      <Typography textAlign='center' component='h2' sx={{fontWeight: 700}} variant='h4'>Reset password</Typography>
      <Typography textAlign='center' color='text.secondary' component='p' mt={2} variant='subtitle1'>Enter your email address to reset your password and regain access to the Empathy Dashboard</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box  sx={{display: 'flex', justifyContent: 'center'}}>
          <Stack mt={5} spacing={2} maxWidth='380px' width='100%'>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    {...field}
                    type="email"
                    placeholder="Type your email"
                    autoComplete="off"
                  />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

            <Box mt={5} display='flex' justifyContent='center'>
              <Box>
                <CustomButton text='Send recovery link' type="submit"/>
              </Box>
            </Box>
          </Stack>
        </Box>
      </form>
    </Box>
  );
}
