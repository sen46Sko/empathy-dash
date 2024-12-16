'use client';
import React from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { OutlinedInput, TextField } from '@mui/material';
import CustomButton from '@/components/core/custom-button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useClients } from '@/hooks/use-clients';
import { useParams, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { clientClient } from '@/lib/clients/clients';
import Alert from '@mui/material/Alert';


const clientValidationSchema = z.object({
  full_name: z.string().min(1, "Client name is required").max(50, "Client name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  birthday: z
    .custom<dayjs.Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
      message: 'Invalid date',
    })
    .refine((date) => date.isBefore(dayjs()) || date.isSame(dayjs(), 'day'), {
      message: 'Date of birth cannot be in the future',
    }),
  therapy_type: z.string().min(1, "Therapy type is required"),
  notes: z.string().max(250, "Notes must be less than 250 characters").optional(),
});

type ClientFormValues = z.infer<typeof clientValidationSchema>;

const CreateClientForm: React.FC = () => {
  const { postClient, isLoading, initClient, editClient, error } = useClients();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    defaultValues: {
      notes: initClient?.notes ? initClient.notes :'',
      birthday: initClient?.birthday ? dayjs(initClient.birthday) : undefined,
      email: initClient?.email ? initClient.email : '',
      full_name: initClient?.full_name ? initClient.full_name : '',
      therapy_type: initClient?.therapy_type ? initClient.therapy_type : undefined,
    },
    resolver: zodResolver(clientValidationSchema),
  });
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isEdit = Boolean(id);
  
  const onSubmit = (data: ClientFormValues) => {
    const values = {
      ...data,
      birthday: data.birthday.toISOString(),
      notes: data.notes || '',
    }

    if (initClient) {
      editClient(Number(id), values);
    } else {
      postClient(values);
    }
  };
  
  const handleCancel = () => {
    router.back();
  }
  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
    >
      <Typography variant="h5">
        {isEdit ? 'Edit client' : 'New client'}
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        <Controller
          control={control}
          name="full_name"
          render={({ field }) => (
            <FormControl error={Boolean(errors.full_name)} fullWidth>
              <InputLabel>Client Name</InputLabel>
              <OutlinedInput
                sx={{ height: '42px', backgroundColor: 'background.paper' }}
                {...field}
                autoComplete="off"
                placeholder="Type your client’s full name"
              />
              {errors.full_name ? (
                <FormHelperText>{errors.full_name.message}</FormHelperText>
              ) : null}
            </FormControl>
          )}
        />
        
        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FormControl error={Boolean(errors.email)} fullWidth>
              <InputLabel>Email Address</InputLabel>
              <OutlinedInput
                sx={{ height: '42px', backgroundColor: 'background.paper' }}
                {...field}
                autoComplete="off"
                placeholder="Type your email"
                type="email"
              />
              {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
      </Box>
      
      <Box sx={{display: 'flex', gap: 2}}>
        <Controller
          control={control}
          name="birthday"
          render={({ field }) => (
            <FormControl error={Boolean(errors.birthday)} fullWidth>
              <InputLabel>Birthday</InputLabel>
              <DatePicker
                {...field}
                sx={{ height: '42px', backgroundColor: 'background.paper', mt: 1 }}
                value={field.value || null}
              />
              {errors.birthday ? (
                <FormHelperText>{errors.birthday.message}</FormHelperText>
              ) : null}
            </FormControl>
          )}
        />
        
        {/* Therapy Type */}
        <Controller
          control={control}
          name="therapy_type"
          render={({ field }) => (
            <FormControl error={Boolean(errors.therapy_type)} fullWidth>
              <InputLabel>Therapy Type</InputLabel>
              <Select
                sx={{ height: '42px', backgroundColor: 'background.paper', color: field.value ? 'text.primary' : 'text.secondary' }}
                {...field}
                displayEmpty
                renderValue={value => value?.length ? Array.isArray(value) ? value.join(', ') : value : 'Select your client’s therapy type'}
                value={field.value || null}
              >
                <MenuItem value="Individual Therapy">Individual Therapy</MenuItem>
                <MenuItem value="Group Therapy">Group Therapy</MenuItem>
                <MenuItem value="Stress Management">Stress Management</MenuItem>
              </Select>
              {errors.therapy_type ? (
                <FormHelperText>{errors.therapy_type.message}</FormHelperText>
              ) : null}
            </FormControl>
          )}
        />
      </Box>
      
      {/* Notes */}
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <FormControl error={Boolean(errors.notes)} fullWidth>
            <InputLabel>Notes</InputLabel>
            <OutlinedInput
              sx={{ backgroundColor: 'background.paper' }}
              {...field}
              multiline
              placeholder="Enter client’s notes"
              rows={4}
            />
            {errors.notes ? <FormHelperText>{errors.notes.message}</FormHelperText> : null}
          </FormControl>
        )}
      />
      
      {error ? <Alert color="error">{error}</Alert> : null}
      
      <Box sx={{ alignSelf: 'center', mt: 10, display: 'flex', gap: 3 }} >
        {isEdit ? (
          <Button disabled={isLoading} color="secondary" onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
        ) : null}
        <CustomButton disabled={isLoading} text={isEdit ? 'Save' : 'Create Client'} type="submit" variant="contained" />
      </Box>
    </Box>
  );
};

export default CreateClientForm;
