import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import styled from '@emotion/styled';
import type { Theme} from '@mui/system';
import { useTheme } from '@mui/system';

interface OtpInputProps {
  onChange: (value: string) => void,
  length: number,
  value: string,
}

const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
  gap: 16px;
  max-width: 580px;
  width: 100%;
  margin-inline: auto;

  div {
    border: none;
    box-shadow: none;
    border-radius: 16px;
  }

  @media (max-width: 768px) {
    div {
      padding: 0;
      border-radius: 8px;
    }
  }

  .MuiOtpInput-TextField {
    background-color: #F3F3F3;
    border: 1px solid transparent;
    border-radius: 16px;
    box-shadow: none;

    input {
      border: 1px solid transparent;
      height: 96px;
      border-radius: 16px;
      outline: none;
      font-size: 2rem;
      font-weight: 700;
      color: ${({theme}) => (theme as Theme).palette.secondary.contrastText as string};

      &:focus {
        border-color: aliceblue;
      }
    }

    @media (max-width: 768px) {
      border-radius: 8px;

      input {
        height: 56px;
        font-size: 1.2rem;
      }
    }
  }
`;

const OtpInput: React.FC<OtpInputProps> = ({onChange, value, length}) => {
  const theme = useTheme();


  const handleChange = (val: string): void => {
    onChange(val);
  }

  return (
    <MuiOtpInputStyled length={length} onChange={handleChange} theme={theme} value={value}/>
  );
};

export default OtpInput;
