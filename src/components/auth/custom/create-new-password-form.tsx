import React, { useEffect, useRef, useState } from 'react';
import { z as zod } from 'zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PasswordStrengthBar from 'react-password-strength-bar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { FilledInput, OutlinedInput } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import CustomButton from '@/components/core/custom-button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import styled from '@emotion/styled';
import { PASSWORD_RULES } from '@/constants/auth/auth.constants';

const schema = zod.object({
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

const defaultValues = { password: '', confirmPassword: '' } satisfies Values;

interface CreateNewPasswordProps {
  handleNextStage: () => void,
}

const StyledPasswordCheck = styled(PasswordStrengthBar)`
  div {
    div {
      height: 8px !important;
      border-radius: 4px;
    }
  }
`;

const CreateNewPasswordForm: React.FC<CreateNewPasswordProps> = ({handleNextStage}) => {
  const {
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema),  reValidateMode: 'onChange' });
  const [isPending, setIsPending] = useState(false);
  const isFirstRender = useRef(true);

  const password = useWatch({
    control,
    name: 'password',
  });

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender.current = false;
    } else {
      trigger('password').then(() => null).catch(() => null).finally(() => null)
    }
  }, [password])

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {

      // setIsPending(true);

      // const { error } = await authClient.resetPassword(values);
      //
      // if (error) {
      //   setError('root', { type: 'server', message: error });
      //   setIsPending(false);
      //   return;
      // }

      setIsPending(false);
      handleNextStage();

      // Redirect to confirm password reset
    },
    [setError]
  );

  return (
    <Box maxWidth='376px'>
      <Typography component='h2' sx={{fontWeight: 700}} textAlign='center' variant='h4'>Reset password</Typography>
      <Typography component='p' color='text.secondary' mt={2} textAlign='center' variant='subtitle1'>Create a new password and regain access to the Empathy Dashboard</Typography>
      <Stack mt={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="password"
              render={({field}) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>New password</InputLabel>
                  <OutlinedInput
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    autoComplete="off"
                    placeholder="Create a strong password"
                    {...field}
                    type="password"
                  />
                  {errors.password ? <FormHelperText color='error.main'>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({field}) => (
                <FormControl error={Boolean(errors.confirmPassword)}>
                  <InputLabel>Confirm password</InputLabel>
                  <OutlinedInput
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    autoComplete="off"
                    placeholder="Repeat your password"
                    {...field}
                    type="password"
                  />
                  {errors.confirmPassword ? <FormHelperText color='error.main'>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>

          <Typography mb={1} mt={2} sx={{ fontSize: '0.75rem' }}>Password strength</Typography>

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

          <Box display='flex' justifyContent='center' mt={5}>
            <Box>
              <CustomButton disabled={isPending} text='Reset Password' type="submit"/>
            </Box>
          </Box>
        </form>
      </Stack>
    </Box>
  );
};

export default CreateNewPasswordForm;
