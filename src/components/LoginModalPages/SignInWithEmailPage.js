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
      <form style={{ textAlign: 'center' }}>
        <TextField
          required
          placeholder="abc@xyz.com"
          label="Email Address"
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText={inputElementProps.helperText}
          error={inputElementProps.error}
          inputRef={EmailRef}
          fullWidth
        />
        <Button variant="contained" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </CustomDialogueContent>
  );
}
