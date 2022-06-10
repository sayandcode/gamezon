import { Button, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CustomDialogueContent from './CustomDialogueContent';

function getInputPropsFor(element) {
  return {
    error: !element.checkValidity(),
    helperText: element.validationMessage,
  };
}

export default function SignInWithEmail() {
  const [value, setValue] = useState('');
  const [inputElementProps, setInputElementProps] = useState({
    error: false,
    helperText: '',
  });
  const [errorChecking, setErrorChecking] = useState(false);

  const EmailRef = useRef();

  useEffect(() => {
    if (errorChecking) {
      const newInputProps = getInputPropsFor(EmailRef.current);
      setInputElementProps(newInputProps);
    }
  }, [value, errorChecking]);

  const handleSubmit = () => {
    const inputElement = EmailRef.current;
    if (inputElement.checkValidity()) {
      // submit it
    } else {
      setErrorChecking(true);
    }
  };
  return (
    <CustomDialogueContent
      heading={<>Sign in With Your Email</>}
      withBackButton
    >
      <TextField
        label="Email Address"
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText={inputElementProps.helperText}
        error={inputElementProps.error}
        inputRef={EmailRef}
      />
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
