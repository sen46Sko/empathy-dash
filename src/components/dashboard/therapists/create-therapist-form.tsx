'use client';
import React, { useEffect } from 'react';
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
import Alert from '@mui/material/Alert';
import { useTherapists } from '@/hooks/use-therapists';
import type { CreateTherapistDTO } from '@/types/therapists/therapists.types';


const therapistValidationSchema = z.object({
  full_name: z.string().min(1, "Therapist name is required").max(50, "Therapist name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  notes: z.string().max(250, "Notes must be less than 250 characters").optional(),
});

type TherapistFormValues = z.infer<typeof therapistValidationSchema>;

const CreateTherapistForm: React.FC = () => {
  const { postTherapist, isLoading, initTherapist, error, setError, editTherapist, setInitTherapist } = useTherapists();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TherapistFormValues>({
    defaultValues: {
      notes: initTherapist?.notes ? initTherapist.notes :'',
      email: initTherapist?.email ? initTherapist.email : '',
      full_name: initTherapist?.full_name ? initTherapist.full_name : '',
    },
    resolver: zodResolver(therapistValidationSchema),
  });
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isEdit = Boolean(id);
  
  useEffect(() => {
    return () => {
      setError(null);
      
      if (initTherapist) {
        setInitTherapist(null);
      }
    }
  }, []);
  
  const onSubmit = (data: TherapistFormValues) => {
    const values = {
      ...data,
      notes: data.notes || '',
      role: 'therapist',
    } as CreateTherapistDTO;

    if (initTherapist) {
      editTherapist(values, initTherapist.id);
    } else {
      postTherapist(values);
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
        {isEdit ? 'Edit therapist' : 'New therapist'}
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
              <InputLabel>Therapist Name</InputLabel>
              <OutlinedInput
                sx={{ height: '42px', backgroundColor: 'background.paper' }}
                {...field}
                autoComplete="off"
                placeholder="Type therapist’s full name"
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
                placeholder="Enter therapist's email"
                type="email"
              />
              {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
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
              placeholder="Enter therapist’s notes"
              rows={4}
            />
            {errors.notes ? <FormHelperText>{errors.notes.message}</FormHelperText> : null}
          </FormControl>
        )}
      />
      
      {error ? <Alert color="error">{error}</Alert> : null}
      
      <Box sx={{ alignSelf: 'center', mt: 10, display: 'flex', gap: 3 }} >
        {isEdit ? (
          <Button color="secondary" disabled={isLoading} onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
        ) : null}
        <CustomButton disabled={isLoading} text={isEdit ? 'Save' : 'Create Therapist'} type="submit" variant="contained" />
      </Box>
    </Box>
  );
};

export default CreateTherapistForm;
