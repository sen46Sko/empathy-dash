import React, { useState } from 'react';
import { Box, styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Dialog, FormControl, TextField } from '@mui/material';
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Radio from '@mui/material/Radio';
import { DateCalendar } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import CalendarHeader from '@/components/dashboard/overview/calendar-header';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { Autocomplete } from '@mui/lab';
import { useClients } from '@/hooks/use-clients';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { convertToCron } from '@/helpers/survey.helper';
import { useSurveys } from '@/hooks/use-surveys';
import { SendScheduleDTO } from '@/types/surveys/survey.types';

interface SendSurveyModalProps {
  sendModeValue: 'now' | 'schedule';
  onClose: () => void;
  id: string,
}

const weekDays = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
];

const schema = z
  .object({
    clients: z
      .array(
        z.object({
          id: z.number(),
          email: z.string().email("Invalid email format"),
          full_name: z.string().min(1, "Name cannot be empty"),
        })
      )
      .min(1, "At least one client must be selected"),
    sendMode: z.enum(['now', 'schedule']),
    frequency: z.enum(['specificDays', 'monthly']).optional(),
    selectedDays: z.array(z.string()),
    date: z
      .preprocess(
        (val) => (typeof val === 'string' ? new Date(val) : val),
        z.date()
          .optional()
          .refine((val) => (val ? !isNaN(val.getTime()) : true), "Invalid date")
      ),
    time: z
      .preprocess(
        (val) => {
          if (typeof val === 'string') {
            const [hours, minutes] = val.split(':').map(Number);
            if (!isNaN(hours) && !isNaN(minutes)) {
              const now = new Date();
              now.setHours(hours, minutes, 0, 0);
              return now;
            }
          }
          return val;
        },
        z.date()
          .optional()
          .refine((val) => (val ? !isNaN(val.getTime()) : true), "Invalid time format")
      ),
    notify: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.sendMode === "schedule") {
      if (!data.frequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Frequency is required for schedule mode",
          path: ["frequency"]
        });
      }
      if (!data.time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time is required for schedule mode",
          path: ["time"]
        });
      }
      
      if (data.frequency && data.frequency !== 'monthly' && data.selectedDays.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one day must be selected",
          path: ["selectedDays"]
        });
      }
      
      if (data.frequency === 'monthly' && !data.date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date is required for monthly frequency",
          path: ["date"]
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

export type FormDataSchedule = FormData;

interface WeekDayProps {
  control: Control<FormData>,
  errors: FieldErrors<FormData>,
}

const WeekDaySelector: React.FC<WeekDayProps> = ({control, errors}) =>{
  return <FormControl fullWidth sx={{ mb: 3 }}>
    <InputLabel sx={{mb: 1}}>Select Days</InputLabel>
    <Controller
      control={control}
      name="selectedDays"
      render={({ field }) => (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          borderRadius: 1,
        }}>
          {weekDays.map((day) => (
            <Chip
              key={day.value}
              label={day.label}
              onClick={() => {
                const currentDays = field.value || [];
                const newDays = currentDays.includes(day.value)
                  ? currentDays.filter(d => d !== day.value)
                  : [...currentDays, day.value];
                field.onChange(newDays);
              }}
              sx={{
                backgroundColor: (field.value || []).includes(day.value)
                  ? 'primary.main'
                  : 'grey.100',
                color: (field.value || []).includes(day.value)
                  ? 'white'
                  : 'text.primary',
                '&:hover': {
                  backgroundColor: (field.value || []).includes(day.value)
                    ? 'primary.dark'
                    : 'grey.200',
                },
              }}
            />
          ))}
        </Box>
      )}
    />
    {errors.selectedDays ? <FormHelperText sx={{color: 'error.main'}}>{errors.selectedDays.message}</FormHelperText> : null}
  </FormControl>
}

const StyledDateCalendar = styled(DateCalendar)({
  '&.MuiDateCalendar-root': {
    margin: '5px',
    height: 'auto',
    width: '100%',
    maxHeight: 'none',
    '& .MuiDayCalendar-weekDayLabel': {
      fontSize: '1rem',
    },
    '& div[role="row"]': {
      justifyContent: 'space-around',
    },
    '& .MuiDayCalendar-slideTransition': {
      minHeight: '350px',
    },
    '& .MuiPickersDay-root': {
      height: '50px',
      width: '50px',
      fontSize: '1rem',
    },
  },
});

const SendSurveyModal: React.FC<SendSurveyModalProps> = ({ sendModeValue, onClose, id }) => {
  const { control, setValue, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clients: [],
      sendMode: sendModeValue,
      frequency: 'monthly',
      selectedDays: [],
      date: new Date(),
      time: new Date(),
      notify: false,
    },
  });
  
  const { clientsList } = useClients();
  const { sendSurvey, sendScheduleSurvey } = useSurveys();
  const sendMode = watch('sendMode');
  const frequency = watch('frequency');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(new Date()));
  const date = watch('date');
  
  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, 'month'));
  };
  
  const handlePreviousMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, 'month'));
  };
  
  const onSubmit = (data: FormData) => {
    if (sendMode === 'now') {
      sendSurvey(Number(id), data.clients.map((item) => item.id), true);
    }
    
    if (sendMode === 'schedule') {
      const combinedDate = new Date(data.date!);
      combinedDate.setHours(new Date((data.time!)).getHours());
      combinedDate.setMinutes(new Date((data.time!)).getMinutes());
      combinedDate.setSeconds(0);
      
      const dataToSend: SendScheduleDTO = {
        survey_id: Number(id),
        cron_expression: convertToCron(data),
        next_run: combinedDate.toISOString(),
        patient_ids: data.clients.map((item) => item.id)
      };
      console.log(dataToSend);
      sendScheduleSurvey(dataToSend);
    }
    
    onClose();
  };
  
  const formatDayOfWeek = (day: string) => {
    const dateObj: Record<string, string> = {
      Su: 'Sun',
      Mo: 'Mon',
      Tu: 'Tue',
      We: 'Wed',
      Th: 'Thu',
      Fi: 'Fri',
      Sa: 'Sat'
    };
    
    return dateObj[day] || day.slice(0, 3);
  };
  
  return (
    <Dialog
      PaperProps={{
        sx: {
          maxWidth: 670,
          width: '100%',
          margin: '20px auto 20px',
          borderRadius: 3,
          padding: 2,
        },
      }}
      open
      scroll="body"
    >
      <Box sx={{ p: 1 }}>
        <Typography sx={{ mb: 3 }} variant="h6">
          Schedule Survey For Clients
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="clients"
            render={({ field }) => (
              <Autocomplete
                {...field}
                getOptionLabel={(option) => `${option.full_name} (${option.email})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                multiple
                onChange={(_, value) => { field.onChange(value); }}
                options={clientsList}
                renderInput={(params) => (
                  <FormControl error={Boolean(errors.clients)} sx={{width: '100%', mb: 5}}>
                    <InputLabel sx={{mb: 1}}>Select clients</InputLabel>
                    <TextField
                      {...params}
                      error={Boolean(errors.clients)}
                      helperText={errors.clients?.message}
                      placeholder="Enter client's name or select from the list"
                      sx={{
                        '& .MuiFilledInput-root': {
                          borderRadius: '8px',
                          padding: '6px',
                        },
                        '& .MuiFilledInput-input': {
                          padding: '12px',
                          height: '32px',
                        },
                        '& .MuiInputLabel-root': {
                          transform: 'translate(14px, 12px) scale(1)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          transform: 'translate(14px, -6px) scale(0.75)',
                          color: '#424242',
                        },
                        '& .MuiAutocomplete-clearIndicator': {
                          display: 'none',
                        },
                      }}
                      variant="filled"
                    />
                  </FormControl>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.full_name}
                      sx={{
                        backgroundColor: '#e5e5e5',
                        color: '#424242',
                        '& .MuiChip-deleteIcon': {
                          color: '#757575',
                        },
                      }}
                    />
                  ))
                }
              />
            )}
          />
          
          <FormControl sx={{ mb: 3 }}>
            <Controller
              control={control}
              name="sendMode"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel control={<Radio />} label="Send now" value="now" />
                  <FormControlLabel control={<Radio />} label="Schedule for later" value="schedule" />
                </RadioGroup>
              )}
            />
          </FormControl>
          
          {sendMode === 'schedule' && (
            <>
              <Controller
                control={control}
                name="frequency"
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Frequency"
                    select
                    sx={{ mb: 3 }}
                    variant='filled'
                  >
                    <MenuItem value="specificDays">Specific days of the week</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                )}
              />
              
              {frequency === 'monthly' ? (
                <>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Controller
                      control={control}
                      name="date"
                      render={({ field }) => (
                        <LocalizationProvider>
                          <FormControl error={Boolean(errors.date)} sx={{ flexGrow: 1 }}>
                            <InputLabel sx={{mb: 1}}>Start date</InputLabel>
                            <DatePicker
                              {...field}
                              onChange={(newValue) => { field.onChange(newValue ? newValue.toDate() : null); }}
                              value={field.value ? dayjs(field.value) : null}
                              slots={{
                                textField: TextField
                              }}
                              slotProps={{
                                textField: {
                                  variant: 'filled',
                                }
                              }}
                            />
                            {errors.date ? <FormHelperText>{errors.date.message}</FormHelperText> : null}
                          </FormControl>
                        </LocalizationProvider>
                      )}
                    />
                    
                    <Controller
                      control={control}
                      name="time"
                      render={({ field, fieldState }) => (
                        <LocalizationProvider>
                          <FormControl error={Boolean(fieldState.error)} sx={{ flexGrow: 1 }}>
                            <InputLabel sx={{mb: 1}}>Time</InputLabel>
                            <TimePicker
                              onChange={(newValue: Dayjs | null) => {
                                field.onChange(newValue ? newValue.toDate() : null);
                              }}
                              value={field.value ? dayjs(field.value) : null}
                              slots={{
                                textField: TextField
                              }}
                              slotProps={{
                                textField: {
                                  variant: 'filled',
                                }
                              }}
                            />
                            {fieldState.error ? <FormHelperText>{fieldState.error.message}</FormHelperText> : null}
                          </FormControl>
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                  
                  <LocalizationProvider>
                    <StyledDateCalendar
                      dayOfWeekFormatter={formatDayOfWeek}
                      onChange={(newDate: Dayjs | null) => {
                        if (newDate) {
                          setValue('date', newDate.toDate());
                        }
                      }}
                      slots={{
                        calendarHeader: (props) => (
                          <CalendarHeader
                            {...props}
                            current={date ? new Date(date) : new Date()}
                            onLeft={handlePreviousMonth}
                            onRight={handleNextMonth}
                          />
                        ),
                      }}
                      value={dayjs(watch('date'))}
                    />
                  </LocalizationProvider>
                </>
              ) : (
                <>
                  <WeekDaySelector control={control} errors={errors}/>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Controller
                      control={control}
                      name="date"
                      render={({ field }) => (
                        <LocalizationProvider>
                          <FormControl error={Boolean(errors.date)} sx={{ flexGrow: 1 }}>
                            <InputLabel sx={{mb: 1}}>Start date</InputLabel>
                            <DatePicker
                              {...field}
                              sx={{
                                backgroundColor: 'background.paper'
                              }}
                              onChange={(newValue) => { field.onChange(newValue ? newValue.toDate() : null); }}
                              value={field.value ? dayjs(field.value) : null}
                              slots={{
                                textField: TextField
                              }}
                              slotProps={{
                                textField: {
                                  variant: 'filled',
                                }
                              }}
                            />
                            {errors.date ? <FormHelperText>{errors.date.message}</FormHelperText> : null}
                          </FormControl>
                        </LocalizationProvider>
                      )}
                    />
                    
                    <Controller
                      control={control}
                      name="time"
                      render={({ field, fieldState }) => (
                        <LocalizationProvider>
                          <FormControl error={Boolean(fieldState.error)} sx={{ flexGrow: 1 }}>
                            <InputLabel sx={{mb: 1}}>Time</InputLabel>
                            <TimePicker
                              onChange={(newValue: Dayjs | null) => {
                                field.onChange(newValue ? newValue.toDate() : null);
                              }}
                              sx={{
                                backgroundColor: 'background.paper'
                              }}
                              value={field.value ? dayjs(field.value) : null}
                              slots={{
                                textField: TextField
                              }}
                              slotProps={{
                                textField: {
                                  variant: 'filled',
                                }
                              }}
                            />
                            {fieldState.error ? <FormHelperText>{fieldState.error.message}</FormHelperText> : null}
                          </FormControl>
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                </>
              )}
            </>
          )}
          
          <Box>
            <FormControlLabel
              control={
                <Controller
                  control={control}
                  name="notify"
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
              label="Notify me when clients complete this survey"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 3 }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default SendSurveyModal;
