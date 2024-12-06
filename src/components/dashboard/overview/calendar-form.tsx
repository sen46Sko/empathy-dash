import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { FilledInput } from '@mui/material';
import CustomDateTimePicker from '@/components/core/date-time-picker';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

const schema = z.object({
  title: z.string().min(1, 'Please enter a title'),
  date: z.date().refine((value) => value instanceof Date && !isNaN(value.getTime()), {
    message: 'Please select a valid date',
  }),
  notes: z.string().max(10, 'Note should not be more than 100 characters').optional(),
});

type CalendarFormData = z.infer<typeof schema>;

const CalendarForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<CalendarFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      notes: '',
    },
  });

  const onSubmit = (data: CalendarFormData) => {
    // TODO
    console.log(data);
  };
  
  return (
    <Box p={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography color='text.primary' fontSize='1.1rem' fontWeight={500} mb={2} mt={3}>New task</Typography>
        
        <Stack spacing={2}>
          <Controller
            control={control}
            name="title"
            render={({field}) => (
              <FormControl error={Boolean(errors.title)}>
                <InputLabel>Title</InputLabel>
                <FilledInput
                  sx={{height: '42px'}}
                  {...field}
                  autoComplete="off"
                  placeholder="Enter task name"
                />
                {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          
          <Controller
            control={control}
            name="date"
            render={({field}) => (
              <FormControl error={Boolean(errors.title)}>
                <CustomDateTimePicker error={errors?.date?.message} onChange={field.onChange} value={field.value}/>
                {errors.date ? <FormHelperText>{errors.date.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          
          <Controller
            control={control}
            name="notes"
            render={({field}) => (
              <FormControl error={Boolean(errors.notes)}>
                <InputLabel>Notes</InputLabel>
                <FilledInput
                  sx={{height: '42px'}}
                  {...field}
                  autoComplete="off"
                  maxRows={4}
                  placeholder="Enter task’s notes"
                />
                {errors.notes ? <FormHelperText>{errors.notes.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Box mt={4}>
            <Box display='flex' gap={2} justifyContent='center' sx={{cursor: 'pointer'}}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                border: 'none',
                background: 'none'
              }} type="submit">
                <AddIcon/>
                <Typography fontWeight={500}>Create Appointment</Typography>
              </button>
            </Box>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default CalendarForm;
