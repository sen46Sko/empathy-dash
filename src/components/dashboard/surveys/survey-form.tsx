import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { Box } from '@mui/system';
import { Modal, OutlinedInput } from '@mui/material';
import SurveyPreview from '@/components/dashboard/surveys/survey-preview';
import type { SurveyFormValues } from '@/types/surveys/survey.types';
import { QuestionTypeEnum } from '@/types/surveys/survey.types';
import SurveyQuestionForm from '@/components/dashboard/surveys/survey-question-form';
import BackButton from '@/components/core/back-button';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useRouter } from 'next/navigation';
import { transformSurveyFormData } from '@/helpers/survey.helper';
import { useSurveys } from '@/hooks/use-surveys';
import type { CustomThemeType } from '@/styles/theme/types';
import Typography from '@mui/material/Typography';

const questionSchema = zod.discriminatedUnion("question_type", [
  zod.object({
    question_type: zod.literal(QuestionTypeEnum.SELECTION),
    question: zod
      .string()
      .min(1, { message: "Question is required" })
      .max(200, { message: "Question must not exceed 200 characters" }),
    options: zod
      .array(
        zod.object({
          value: zod
            .string()
            .min(1, { message: "Option value is required" })
            .max(100, { message: "Option value must not exceed 100 characters" }),
        })
      )
      .min(2, { message: "Each question must have at least 2 options" })
      .max(6, { message: "Each question can have at most 6 options" }),
  }),
  zod.object({
    question_type: zod.literal(QuestionTypeEnum.YESNO),
    question: zod
      .string()
      .min(1, { message: "Question is required" })
      .max(200, { message: "Question must not exceed 200 characters" }),
    options: zod.undefined(),
  }),
  zod.object({
    question_type: zod.literal(QuestionTypeEnum.TEXT),
    question: zod
      .string()
      .min(1, { message: "Question is required" })
      .max(200, { message: "Question must not exceed 200 characters" }),
    options: zod.undefined(),
  }),
]);

const schema = zod.object({
  name: zod.string().min(1, { message: "Survey name is required" }),
  category_id: zod.number({invalid_type_error: 'Invalid value'}).min(1, { message: "Category is required" }),
  questions: zod
    .array(questionSchema)
    .min(1, { message: "At least 1 question is required" })
    .max(100, { message: "You can add at most 100 questions" }),
});

const categorySchema = zod.object({
  category: zod.string().min(1, {message: 'Category name is required'})
});

const SurveyForm: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const { postSurvey, categories, postCategory, currentSurvey, editSurvey, isMinorLoading } = useSurveys();

  const defaultValues = id ? currentSurvey! : {
    name: '',
    category_id: null,
    questions: [
      {
        question: '',
        question_type: QuestionTypeEnum.SELECTION,
        options: [
          {
            value: '',
          },
          {
            value: '',
          }
        ],
      },
    ],
  };

  const methods = useForm<SurveyFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  
  const { control, handleSubmit, watch, formState: { errors } } = methods;
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions",
  });
  
  const { control: categoryControl, handleSubmit: handleSubmitCategory, setValue } = useForm<{category: string}>({
    defaultValues: { category: '' },
    resolver: zodResolver(categorySchema),
  });
  const [isCreateOpen, setCreateOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const values = watch();

  const goBack = () => {
    router.back();
  }
  
  const submit = (data: SurveyFormValues) => {
    if (id) {
      editSurvey(transformSurveyFormData(data), Number(id));
    } else {
      postSurvey(transformSurveyFormData(data));
    }
  }
  
  const submitCategory = (data: { category: string }) => {
    postCategory(data.category);
    setCreateOpen(false);
    setValue('category', '');
  }
  
  const handleAddOption = () => {
    appendQuestion({
      question: '',
      question_type: QuestionTypeEnum.SELECTION,
      options: [
        {
          value: '',
        },
        {
          value: '',
        }
      ]
    })
  }
  
  const handleRemove = (index: number) => {
    removeQuestion(index);
  }
  
  return (
    <Box>
      {isCreateOpen ? (
        <Box
          ref={rootRef}
          sx={{
            flexGrow: 1,
            minWidth: 300,
            transform: 'translateZ(0)',
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            top: 0,
            zIndex: 10000,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
          }}
        >
          <Modal
            aria-describedby="server-modal-description"
            aria-labelledby="server-modal-title"
            container={() => rootRef.current!}
            disableAutoFocus
            disableEnforceFocus
            disablePortal
            open
            sx={{
              display: 'flex',
              p: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={(theme) => ({
                bgcolor: 'background.paper',
                minWidth: 320,
                maxWidth: 420,
                width: '100%',
                borderRadius: 3,
                boxShadow: (theme as CustomThemeType).shadows[2],
                p: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              })}
            >
              <form
                style={{
                  width: '100%'
                }}
                onSubmit={handleSubmitCategory(submitCategory)}
              >
                <Typography
                  variant='h6'
                  sx={{
                    mb: 2,
                  }}
                >
                  Create survey category
                </Typography>
                
                <Controller
                  control={categoryControl}
                  name="category"
                  render={({field}) => (
                    <FormControl error={Boolean(errors.name)} fullWidth>
                      <InputLabel>Category name</InputLabel>
                      <OutlinedInput
                        sx={{height: '42px', backgroundColor: 'background.paper'}}
                        {...field}
                        autoComplete="off"
                        placeholder="Type your category name"
                      />
                      {errors.name ? (
                        <FormHelperText>{errors.name.message}</FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
                
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    mt: 5,
                  }}
                >
                  <Button onClick={() => {setCreateOpen(false)}} color="secondary" variant="outlined">
                    Cancel
                  </Button>
                  <Button disabled={isMinorLoading} type='submit' color="primary" variant="contained">
                    Create
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
        </Box>
      ) : null}
      
      
      <FormProvider {...methods}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <BackButton onClick={goBack}/>
        
        <Box display='flex' gap={2} justifyContent='center'>
          <Button color="primary" onClick={handleAddOption} startIcon={<AddIcon/>}>New question</Button>
          <Button color="primary" onClick={() => {setCreateOpen(true)}} startIcon={<AddIcon/>}>New category</Button>
        </Box>
      </Box>
      
      <form
        onSubmit={handleSubmit(submit, (e) => console.log(e))}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            marginTop: 3,
          }}
        >
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: 'column',
              flexBasis: '50%',
            }}
          >
            <Controller
              control={control}
              name="name"
              render={({field}) => (
                <FormControl error={Boolean(errors.name)} fullWidth>
                  <InputLabel>Survey name</InputLabel>
                  <OutlinedInput
                    sx={{height: '42px', backgroundColor: 'background.paper'}}
                    {...field}
                    autoComplete="off"
                    placeholder="Type your survey name"
                  />
                  {errors.name ? (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            
            <Controller
              control={control}
              name="category_id"
              render={({field}) => (
                <FormControl error={Boolean(errors.category_id)} fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    sx={{
                      height: '42px',
                      backgroundColor: 'background.paper',
                      color: field.value ? 'text.primary' : 'text.secondary'
                    }}
                    {...field}
                    displayEmpty
                    renderValue={value => value ? (categories.find((item) => item.id === Number(value)))?.category || 'Select category' : 'Select category'}
                    value={field.value || null}
                  >
                    {categories.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.category}</MenuItem>
                    ))}
                  </Select>
                  {errors.category_id ? (
                    <FormHelperText>{errors.category_id.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            
            {questionFields.map((question, index) => (
              <SurveyQuestionForm
                control={control}
                errors={errors}
                handleRemove={handleRemove}
                key={question.id}
                questionIndex={index}
                questionLength={questionFields.length}
              />
            ))}
          </Box>
          <Box
            sx={{
              flexBasis: '50%',
            }}
          >
            <SurveyPreview values={values}/>
          </Box>
          
        </Box>
      </form>
      </FormProvider>

    </Box>
  );
};

export default SurveyForm;
