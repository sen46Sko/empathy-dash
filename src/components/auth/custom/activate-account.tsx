'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useUser } from '@/hooks/use-user';
import { OutlinedInput } from '@mui/material';
import CustomButton from '@/components/core/custom-button';
import { authClient } from '@/lib/auth/custom/client';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import { User } from '@/types/user';

const schema = zod.object({
  password: zod.string().min(1, { message: 'Password is required' }),
  confirmPassword: zod
    .string()
    .min(1, { message: 'Confirm Password is required' }),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: zod.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Passwords must match',
    });
  }
});

type Values = zod.infer<typeof schema>;

const defaultValues = { confirmPassword: '', password: '' } satisfies Values;

export function ActivateForm(): React.JSX.Element {
  const router = useRouter();
  const { user, setUser } = useUser();
  
  const [showPassword, setShowPassword] = React.useState<boolean>();
  
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
  
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error, data } = await authClient.activateAccount(values, axiosPrivate);
      
      if (error) {
        // setError('root', { type: 'server', message: error  });
        setError('root', { type: 'server', message: Array.isArray(error) ? error[0] as string : error  });
        setIsPending(false);

      }

      else if (data) {
        setUser({
          ...user!,
          status: 'active',
        });
        setIsPending(false);
        router.refresh();
      }
    },
    // [checkSession, router, setError]
    []
  );
  
  return (
    <Box sx={{width: '100%'}}>
      <Typography component='h2' mt={5} sx={{fontWeight: 700}} variant='h4'>Account Activation</Typography>
      <Typography color='text.secondary' component='p' mt={2} variant='subtitle1'>To activate your account, please create a new password!</Typography>
      <Stack mt={3} spacing={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="password"
              render={({field}) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    {...field}
                    autoComplete="off"
                    placeholder="Type your password"
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(true);
                          }}
                        />
                      )
                    }
                    type={showPassword ? 'text' : 'password'}
                  />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({field}) => (
                <FormControl error={Boolean(errors.confirmPassword)}>
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput
                    autoComplete="off"
                    placeholder="Confirm your password"
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    {...field}
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(true);
                          }}
                        />
                      )
                    }
                    type={showPassword ? 'text' : 'password'}
                  />
                  {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
          
          <Box display='flex' justifyContent='center' mt={8}>
            <CustomButton disabled={isPending} text='Activate' type="submit"/>
          </Box>
        </form>
      </Stack>
    </Box>
  );
}
