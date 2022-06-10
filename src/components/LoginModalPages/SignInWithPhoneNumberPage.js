import { Button } from '@mui/material';
import { useState } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import MuiPhoneNumberInput from '../MuiPhoneNumberInput';
import CustomDialogueContent from './CustomDialogueContent';

const errorState = {
  error: true,
  helperText: 'Enter a valid phone Number',
};

const normalState = {
  error: false,
  helperText: '',
};

export default function SignInWithPhoneNumberPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorChecking, setErrorChecking] = useState(false);
  const [phoneInputProps, setPhoneInputProps] = useState(normalState);

  const handleChange = (newVal) => {
    setPhoneNumber(newVal);
    if (errorChecking) {
      const newPhoneInputProps = isPossiblePhoneNumber(newVal)
        ? normalState
        : errorState;
      setPhoneInputProps(newPhoneInputProps);
    }
  };

  const handleSubmit = () => {
    if (!isPossiblePhoneNumber(phoneNumber)) {
      setErrorChecking(true);
      setPhoneInputProps(errorState);
    } else {
      // submit form
      console.log('Submitted');
    }
  };
  return (
    <CustomDialogueContent
      heading={<>Sign in With Your Phone Number</>}
      withBackButton
    >
      <div style={{ textAlign: 'center' }}>
        <MuiPhoneNumberInput
          helperText={phoneInputProps.helperText}
          error={phoneInputProps.error}
          onChange={handleChange}
        />
      </div>
      <Button
        variant="contained"
        size="large"
        sx={{ my: 2, marginInline: '50%', transform: 'translateX(-50%)' }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </CustomDialogueContent>
  );
}
