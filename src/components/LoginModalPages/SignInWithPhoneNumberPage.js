import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import MuiPhoneNumberInput from '../MuiPhoneNumberInput';
import CustomDialogueContent from './CustomDialogueContent';

function getInputPropsFrom(phoneNumber) {
  const error = !isPossiblePhoneNumber(phoneNumber);
  return {
    error,
    helperText: error ? 'Enter a valid Phone number' : '',
  };
}

export default function SignInWithPhoneNumberPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorChecking, setErrorChecking] = useState(false);
  const [phoneInputProps, setPhoneInputProps] = useState({
    error: false,
    helperText: '',
  });

  useEffect(() => {
    if (errorChecking) {
      const newPhoneInputProps = getInputPropsFrom(phoneNumber);
      setPhoneInputProps(newPhoneInputProps);
    }
  }, [errorChecking, phoneNumber]);

  const handleSubmit = () => {
    if (!isPossiblePhoneNumber(phoneNumber)) {
      setErrorChecking(true);
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
          onChange={(newVal) => setPhoneNumber(newVal)}
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
