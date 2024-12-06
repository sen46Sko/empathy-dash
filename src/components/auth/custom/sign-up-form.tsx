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
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/custom/client';
import { useUser } from '@/hooks/use-user';
import { toast } from '@/components/core/toaster';
import { FilledInput } from '@mui/material';
import CustomButton from '@/components/core/custom-button';
import List from '@mui/material/List';
import { PASSWORD_RULES } from '@/constants/auth/auth.constants';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import styled from '@emotion/styled';
import PasswordStrengthBar from 'react-password-strength-bar';

interface OAuthProvider {
  id: 'google' | 'discord';
  name: string;
  logo: string;
}

const StyledPasswordCheck = styled(PasswordStrengthBar)`
  div {
    div {
      height: 8px !important;
      border-radius: 4px;
    }
  }
`;

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' }),
  confirmPassword: zod.string().refine((value) => value, 'Confirm password is required'),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession, setUser } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const password = useWatch({
    control,
    name: 'password',
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const { error, data } = await authClient.signUp(values);
      
      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        
      } else if (data) {
        setUser(data.data, data.jwt);
        setIsPending(false);
        router.refresh();
      }
    },
    [router, setError]
  );

  return (
    <Box>
      <Typography component='h2' sx={{fontWeight: 700}} variant='h4'>Join Empathy Dashboard</Typography>
      <Typography component='p' color='text.secondary' mt={2} variant='subtitle1'>Sign up to access the Empathy Dashboard and start managing your tasks and clients with ease</Typography>

      <Stack mt={3} spacing={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>

            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.firstName)}>
                  <InputLabel>First name</InputLabel>
                  <FilledInput
                    placeholder="Enter your first name"
                    sx={{height: '56px'}}
                    {...field}
                  />
                  {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.lastName)}>
                  <InputLabel>Last name</InputLabel>
                  <FilledInput
                    placeholder="Enter your last name"
                    sx={{height: '56px'}}
                    {...field}
                  />
                  {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <FilledInput
                    placeholder="Type your email"
                    sx={{height: '56px'}}
                    {...field}
                  />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <FilledInput
                    placeholder="Create a strong password"
                    sx={{height: '56px'}}
                    {...field}
                    type="password"
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
                  <InputLabel>Confirm password</InputLabel>
                  <FilledInput
                    autoComplete="off"
                    placeholder="Repeat your password"
                    sx={{height: '56px'}}
                    {...field}
                    type="password"
                  />
                  {errors.confirmPassword ? <FormHelperText color='error.main'>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <StyledPasswordCheck
              password={password}
              scoreWordStyle={{
                display: 'none',
              }}
            />

            <Typography mb={1} mt={2} sx={{ fontSize: '0.75rem' }}>Make sure your password has the following criteria:</Typography>

            <List disablePadding sx={{paddingLeft: '20px'}}>
              {PASSWORD_RULES.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    sx={{ listStyleType: 'disc', display: 'list-item', padding: 0, fontSize: '0.85rem' }}
                  >
                    <ListItemText>
                      <Typography sx={{ fontSize: '0.75rem' }}>{item}</Typography>
                    </ListItemText>
                  </ListItem>
                )
              })}
            </List>

            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

            <Box mt={8} display='flex' justifyContent='center'>
              <Box maxWidth='120px' width='100%'>
                <CustomButton text='Sign Up' type="submit" disabled={isPending}/>
              </Box>
            </Box>

            <Box mt={1} display='flex' justifyContent='center' alignItems='center'>
              <Typography variant="body1">{`Already have an account?`}&nbsp;</Typography>
              <Link sx={{fontWeight: 700}} component={RouterLink} href={paths.auth.custom.signIn} variant="body1">
                Sign in
              </Link>
            </Box>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
