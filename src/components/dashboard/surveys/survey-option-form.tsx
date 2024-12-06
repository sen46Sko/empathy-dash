import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Box } from '@mui/system';

interface SurveyOptionFormProps {
  control: any,
  errors: any,
  index: number,
}

const SurveyOptionForm: React.FC<SurveyOptionFormProps> = ({errors, control, index}) => {
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: `questions[${index}].options`
  });
  
  return (
    <Box>
      <p>Option</p>
    </Box>
  );
};

export default SurveyOptionForm;
