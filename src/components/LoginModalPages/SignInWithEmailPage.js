import { Alert, Button, Collapse, IconButton, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { Close as CloseIcon } from '@mui/icons-material';
import { auth } from '../../utlis/firebase-config';
import CustomDialogueContent from './CustomDialogueContent';

function getInputPropsFor(element) {
  return {
    error: !element.checkValidity(),
    helperText: element.validationMessage,
  };
}

const noAlertConfig = {
  show: false,
  textContent: '',
  success: null,
};

export default function SignInWithEmail() {
  const [emailValue, setEmailValue] = useState('');
  const [inputElementProps, setInputElementProps] = useState({
    error: false,
    helperText: '',
  });
  const [errorChecking, setErrorChecking] = useState(false);
  const [endAlert, setEndAlert] = useState(noAlertConfig);

  const EmailRef = useRef();

  useEffect(() => {
    if (errorChecking) {
      const newInputProps = getInputPropsFor(EmailRef.current);
      setInputElementProps(newInputProps);
    }
  }, [emailValue, errorChecking]);

  /* Handle Submit */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = () => {
    const inputElement = EmailRef.current;
    if (!inputElement.checkValidity()) {
      setErrorChecking(true);
    } else {
      // submit it
      setIsSubmitting(true);
      sendSignInLinkToEmail(auth, emailValue, {
        url: 'http://localhost:3000/confirmEmailLogin',
        handleCodeInApp: true,
      })
        .then(() => {
          window.localStorage.setItem('emailForSignIn', emailValue);
          setEndAlert({
            show: true,
            textContent: `Check '${emailValue}' for a new email from us!`,
            success: true,
          });
          setIsSubmitting(false);
        })
        .catch((err) => {
          setEndAlert({
            show: true,
            textContent: err.message,
            success: false,
          });
          setIsSubmitting(false);
        });
    }
  };
  return (
    <CustomDialogueContent heading="Sign in With Your Email" withBackButton>
      <Collapse in={endAlert.show}>
        <Alert
          variant="filled"
          severity={endAlert.success ? 'success' : 'error'}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setEndAlert(noAlertConfig)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {endAlert.textContent}
        </Alert>
      </Collapse>
      <form style={{ textAlign: 'center' }}>
        <TextField
          required
          placeholder="abc@xyz.com"
          label="Email Address"
          type="email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          helperText={inputElementProps.helperText}
          error={inputElementProps.error}
          inputRef={EmailRef}
          InputProps={{ readOnly: endAlert.success }}
          focused
          fullWidth
        />
        <Button
          disabled={isSubmitting}
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </CustomDialogueContent>
  );
}
