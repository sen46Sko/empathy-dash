import React, { useEffect, useRef } from 'react';
import type { Control, FieldErrors} from 'react-hook-form';
import { useFormContext , Controller, useFieldArray } from 'react-hook-form';
import { Box } from '@mui/system';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { OutlinedInput } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import type { SurveyFormValues, SurveyOptionFormValue } from '@/types/surveys/survey.types';
import { QuestionTypeEnum } from '@/types/surveys/survey.types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface SurveyQuestionProps {
  control: Control<SurveyFormValues>;
  errors: FieldErrors<SurveyFormValues>;
  questionIndex: number,
  questionLength: number,
  handleRemove: (index: number) => void,
}

const SurveyQuestionForm:React.FC<SurveyQuestionProps> = ({errors, control, questionIndex, handleRemove, questionLength}) => {
  const { setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error missing type
    name: `questions[${questionIndex}].options`
  });
  const questionType = watch(`questions.${questionIndex}.question_type`) as QuestionTypeEnum;
  const options = watch(`questions.${questionIndex}.options`) as SurveyOptionFormValue[] | undefined;
  
  useEffect(() => {
    if (questionType === QuestionTypeEnum.YESNO || questionType === QuestionTypeEnum.TEXT) {
      setValue(`questions.${questionIndex}.options`, undefined);
    }
  }, [])
  
  const handleCheckBoxChange = (value: QuestionTypeEnum) => {
    setValue(`questions.${questionIndex}.question_type`, value);

    if (value === QuestionTypeEnum.YESNO || value === QuestionTypeEnum.TEXT) {
      setValue(`questions.${questionIndex}.options`, undefined);
    }

    if (value === QuestionTypeEnum.SELECTION) {
      setValue(`questions.${questionIndex}.options`, [
        {
          value: '',
        },
        {
          value: '',
        }
      ]);
    }
  };
  
  const handleAppendOption = () => {
    append({
      value: '',
    })
  }
  
  const handleDeleteOption = (index: number) => {
    if (fields.length <= 2) return;

    remove(index);
  }
  
  const handleDeleteQuestion = () => {

    if (questionLength <= 1) return;

    handleRemove(questionIndex);
  }
  
  return (
    <Box>
      <Box>
        <Controller
          control={control}
          name={`questions.${questionIndex}.question`}
          render={({field}) => (
            <FormControl
              error={Boolean(errors?.questions?.[questionIndex]?.question)}
              fullWidth
            >
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <InputLabel>{`Question ${questionIndex + 1}`}</InputLabel>
                <Typography
                  onClick={handleDeleteQuestion}
                  sx={{
                    fontSize: '0.7rem',
                    cursor: questionLength <= 1 ? 'default' : 'pointer',
                    color: questionLength <= 1 ? 'text.disabled' : 'text.secondary',
                    userSelect: 'none',
                    marginLeft: 1,
                    '&:hover': {
                      color: questionLength <= 1 ? 'text.disabled' : 'error.main',
                    },
                  }}
                >
                  Remove
                </Typography>
              </Box>
              <OutlinedInput
                {...field}
                autoComplete="off"
                placeholder={`Enter question ${questionIndex + 1}`}
                sx={{height: "42px", backgroundColor: "background.paper"}}
              />
              {errors.questions?.[questionIndex]?.question?.message ? <FormHelperText>
                {errors.questions[questionIndex]?.question?.message}
              </FormHelperText> : null}
            </FormControl>
          )}
        />
      </Box>
      
      <Box
        sx={{
          my: 2,
        }}
      >
        <Controller
          control={control}
          name={`questions.${questionIndex}.question_type`}
          render={({ field }) => {
            return (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value === QuestionTypeEnum.SELECTION}
                      onChange={() => { handleCheckBoxChange(QuestionTypeEnum.SELECTION)}}
                    />
                  }
                  label="Selection"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value === QuestionTypeEnum.YESNO}
                      onChange={() => { handleCheckBoxChange(QuestionTypeEnum.YESNO)}}
                    />
                  }
                  label="Yes, no answer"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value === QuestionTypeEnum.TEXT}
                      onChange={() => { handleCheckBoxChange(QuestionTypeEnum.TEXT)}}
                    />
                  }
                  label="Text field"
                />
              </Box>
            )
          }}
        />
      </Box>
      
      {options?.map((item, index) => {
        return (
          <Box
            key={item.id}
            sx={{mb: 2}}
          >
            <Controller
              control={control}
              name={`questions.${questionIndex}.options.${index}.value`}
              render={({field}) => (
                <FormControl
                  error={Boolean(errors?.questions?.[questionIndex]?.options?.[index]?.value?.message)}
                  fullWidth
                >
                  <InputLabel sx={{mb: 1}}>{`Option ${index + 1}`}</InputLabel>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <OutlinedInput
                      {...field}
                      autoComplete="off"
                      placeholder={`Enter option ${index + 1}`}
                      sx={{height: "42px", backgroundColor: "background.paper", width: '100%'}}
                    />
                    <DeleteIcon
                      onClick={() => { handleDeleteOption(index); }}
                      sx={{
                        cursor: fields.length <= 2 ? 'default' : 'pointer',
                        color: fields.length <= 2 ? 'text.disabled' : 'text.secondary',
                        marginLeft: 1,
                        fontSize: 18,
                        '&:hover': {
                          color: fields.length <= 2 ? 'text.disabled' : 'text.primary',
                        },
                      }}
                    />
                  </Box>
                  {errors?.questions?.[questionIndex]?.options?.[index]?.value?.message ?
                    <FormHelperText
                      sx={{
                        color: 'error.main'
                      }}
                    >
                      {errors?.questions?.[questionIndex]?.options?.[index]?.value?.message}
                    </FormHelperText> : null}
                </FormControl>
              )}
            />
            
          </Box>
        )
      })}
      
      {questionType === QuestionTypeEnum.SELECTION && (
        <Box display='flex' justifyContent='center'>
          <Button
            color="primary"
            disabled={fields.length >= 6}
            onClick={handleAppendOption}
            startIcon={<AddIcon/>}
          >
            New option
          </Button>
        </Box>
      )}
      
      <Divider sx={{mt: 2}}/>
    </Box>
  );
};

export default SurveyQuestionForm;
