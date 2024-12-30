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
import CustomButton from '@/components/core/custom-button';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/custom/client';
import { useRouter } from 'next/navigation';
import { useNoteAxiosPrivate } from '@/hooks/use-notes-axios-private';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';

const schema = zod
  .object({
    password: zod.string().min(1, { message: 'Password is required' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type Values = zod.infer<typeof schema>;

const defaultValues = { password: '', confirmPassword: '' } satisfies Values;

const DeleteNoteAccount: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>();
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const axiosPrivate = useNoteAxiosPrivate();
  const [isComplete, setIsComplete] = useState(false);
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
  
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const { data, error } = await authClient.deleteNotesAccount(axiosPrivate, values.password);
      
      if (data) {
        setIsComplete(true);
      }
      
      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
      }
      
      console.log(data);
    },
    []
  );
  
  return (
   <>
     {isComplete ? (
       <Box
         sx={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           flexDirection: 'column',
           position: 'absolute',
           top: '50%',
           transform: 'translate(-50%, -50%)',
           left: '50%',
         }}
       >
         <CheckCircleIcon sx={{fontSize: '6rem'}}/>
         <Typography
           sx={{
             fontSize: '2rem',
             textAlign: 'center',
           }}
         >
           Your account and all associated data have been completely deleted.
         </Typography>
         <Typography
           sx={{
             color: 'text.secondary',
             textAlign: 'center',
           }}
         >
           We will be waiting for your return to Notes For Therapy
         </Typography>
       </Box>
     ) : (
       <Box sx={{maxWidth: '450px', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
         <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
           <Stack spacing={2}>
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
             
             <Controller
               control={control}
               name="confirmPassword"
               render={({field}) => (
                 <FormControl error={Boolean(errors.password)}>
                   <InputLabel>Confirm password</InputLabel>
                   <OutlinedInput
                     autoComplete="off"
                     placeholder="Confirm your password"
                     sx={{height: '42px', backgroundColor: 'background.paper'}}
                     {...field}
                     endAdornment={
                       showConfirmPassword ? (
                         <EyeIcon
                           cursor="pointer"
                           fontSize="var(--icon-fontSize-md)"
                           onClick={(): void => {
                             setShowConfirmPassword(false);
                           }}
                         />
                       ) : (
                         <EyeSlashIcon
                           cursor="pointer"
                           fontSize="var(--icon-fontSize-md)"
                           onClick={(): void => {
                             setShowConfirmPassword(true);
                           }}
                         />
                       )
                     }
                     type={showConfirmPassword ? 'text' : 'password'}
                   />
                   {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                 </FormControl>
               )}
             />
             {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
           </Stack>
           
           <Box display='flex' justifyContent='center' mt={8}>
             <CustomButton disabled={isPending} text='Delete Account' type="submit"/>
           </Box>
         </form>
       </Box>
     )}
   
   </>
  );
};

export default DeleteNoteAccount
;
