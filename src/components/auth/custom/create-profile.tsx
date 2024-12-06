'use client';
import  React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { OutlinedInput } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import styled from '@emotion/styled';
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';
import CustomButton from '@/components/core/custom-button';
import { Option } from '@/components/core/option';
import { authClient } from '@/lib/auth/custom/client';
import { useAxiosPrivate } from '@/hooks/use-axios-private';
import type { User } from '@/types/user';

const schema = zod.object({
  organization: zod.string().min(1, { message: 'Organization name is required' }),
  role: zod.enum(['manager', 'supervisor', 'clinician', 'other', 'none'], {
    errorMap: () => ({ message: 'Role is required' })
  }).refine(value => value !== 'none', {
    message: 'Role is required',
  }),
  telphone: zod.string().refine(value => matchIsValidTel(value, {
    continents: []
  }), {
    message: 'Invalid phone number'
  })
});

type Values = zod.infer<typeof schema>;

const defaultValues = { organization: '', role: 'none', telphone: '' } satisfies Values;

const MuiTelInputStyled = styled(MuiTelInput)`
  width: 100%;
  padding: 0;
  

  & input {
    height: 42px;
  }

  .MuiTelInput-Flag {
    display: none;
  }

  .MuiTelInput-IconButton {
    display: none;
  }
  
  .MuiInputBase-root {
    padding: 0 8px;
  }
`

interface CreateProfileProps {
  handleNext: (data: User) => void,
}

const CreateProfile: React.FC<CreateProfileProps> = ({handleNext}) => {
  const [isPending, setIsPending] = useState(false);
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

      const { error, data } = await authClient.completeProfile(values, axiosPrivate);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);

      }
      
      if (data) {
        
        console.log('DATA.DATA', data.data);
        
        handleNext(data.data);
      }
      setIsPending(false);
    },
    [setError]
  );

  return (
    <Box>
      <Typography component='h2' sx={{fontWeight: 700}} variant='h4'>Create your profile</Typography>
      <Typography color='text.secondary' component='p' mt={2} variant='subtitle1'>Complete your profile info in order to have a better experience</Typography>

      <Stack mt={3} spacing={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
          <Controller
            control={control}
            name="organization"
            render={({ field }) => (
              <FormControl error={Boolean(errors.organization)}>
                <InputLabel>Organization name</InputLabel>
                <OutlinedInput
                  sx={{height: '42px'}}
                  {...field}
                  autoComplete="off"
                  placeholder="Enter your business name"
                />
                {errors.organization ? <FormHelperText>{errors.organization.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <FormControl error={Boolean(errors.role)}>
                <InputLabel>Role</InputLabel>
                <Select
                  sx={{ color: field.value === 'none' ? 'text.secondary' : ''}}
                  {...field}
                >
                  <Option value="none">Select your role</Option>
                  <Option value="clinician">Clinician</Option>
                  <Option value="supervisor">Supervisor</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="other">Other</Option>
                </Select>
                {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="telphone"
            render={({ field }) => (
              <FormControl error={Boolean(errors.telphone)}>
                <InputLabel>Phone umber</InputLabel>
                <Box mt={1} width='100%'>
                  <MuiTelInputStyled
                    {...field}
                    placeholder="Enter your phone number"
                    sx={{height: '42px'}}
                  />
                </Box>
                {errors.telphone ? <FormHelperText>{errors.telphone.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          </Stack>

          <Box display='flex' justifyContent='center' mt={8}>
            <Box maxWidth='120px' width='100%'>
              <CustomButton disabled={isPending} text='Finish' type="submit"/>
            </Box>
          </Box>
        </form>
      </Stack>
    </Box>
  );
};

export default CreateProfile;
