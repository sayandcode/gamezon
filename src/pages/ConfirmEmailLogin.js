import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  Close as CloseIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../utlis/firebase-config';

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

function ConfirmEmailLogin() {
  const [open, setOpen] = useState(true);
  const closeDialog = () => setOpen(false);
  const [endAlert, setEndAlert] = useState(noAlertConfig);

  const [emailValue, setEmailValue] = useState(
    window.localStorage.getItem('emailForSignIn')
  );

  /* Try Auto SignIn if on same computer */
  useEffect(() => {
    if (emailValue && isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, emailValue, window.location.href).then(() => {
        window.localStorage.removeItem('emailForSignIn');
        closeDialog();
      });
    }
  }, []);

  /* ErrorChecking */
  const [inputElementProps, setInputElementProps] = useState({
    error: false,
    helperText: '',
  });
  const EmailRef = useRef();
  const [errorChecking, setErrorChecking] = useState(false);
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
      setIsSubmitting(true);
      signInWithEmailLink(auth, emailValue, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          setEndAlert({
            show: true,
            textContent: 'Successfully Logged In!',
            success: true,
          });
          setIsSubmitting(false);
          setTimeout(closeDialog, 1500);
        })
        .catch((err) => {
          setEndAlert({
            show: true,
            textContent:
              err.code === 'auth/invalid-action-code'
                ? "You've already used that link. Try getting a new link by signing in again."
                : err.message,
            success: false,
          });
          setIsSubmitting(false);
        });
    }
  };

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        Confirm Your Email Address
        <Tooltip
          title="We noticed that you're using a different device from earlier.
          This additional step helps to secure your account."
        >
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <IconButton sx={{ ml: 'auto' }} edge="end" onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
            label="Confirm Email Address"
            type="email"
            value={emailValue || ''}
            onChange={(e) => setEmailValue(e.target.value)}
            helperText={inputElementProps.helperText}
            error={inputElementProps.error}
            inputRef={EmailRef}
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
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmEmailLogin;
