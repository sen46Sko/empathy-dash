'use client';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { OutlinedInput } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import CustomButton from '@/components/core/custom-button';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/custom/client';
import { useRouter } from 'next/navigation';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'aleksandrtarasovi44@gmail.com', password: '5645856adF' } satisfies Values;

const NotesSignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const { setNotesUser, checkSession } = useUser();
  const router = useRouter();
  const {  } = useUser();
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
  
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const { data, error } = await authClient.notesSignIn(values);
      
      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
      }
    
      else if (data) {
        setNotesUser(data.user_details, data.token);
        setIsPending(false);
        router.refresh();
      }
    },
    [checkSession, router, setError]
  );
  
  return (
    <Box sx={{maxWidth: '450px', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
      <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
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
    </Box>
  );
};

export default NotesSignIn
;
