'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/custom/client';
import { useUser } from '@/hooks/use-user';
import { OutlinedInput } from '@mui/material';
import CustomButton from '@/components/core/custom-button';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'test@gmail.com', password: 'test' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession, setUser } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

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

      const { error, data } = await authClient.signInWithPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);

      }

      else if (data) {
        setUser(data.data, data.jwt);
        setIsPending(false);
        router.refresh();
      }
    },
    [checkSession, router, setError]
  );

  return (
    <Box>
      <Typography component='h2' mt={5} sx={{fontWeight: 700}} variant='h4'>Welcome back to <br/> Empathy Dashboard</Typography>
      <Typography color='text.secondary' component='p' mt={2} variant='subtitle1'>Sign in to access the Empathy Dashboard and continue your therapy practice journey</Typography>
      <Stack mt={3} spacing={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({field}) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    {...field}
                    autoComplete="off"
                    placeholder="Type your email"
                    type="email"
                  />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({field}) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    autoComplete="off"
                    placeholder="Type your password"
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
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>

          <Box display='flex' justifyContent='center' mt={8}>
            <CustomButton disabled={isPending} text='Sign In' type="submit"/>
          </Box>
        </form>
      </Stack>
    </Box>
  );
}
