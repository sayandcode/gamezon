import { Alert, Button, Collapse, IconButton, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Close as CloseIcon } from '@mui/icons-material';
import MuiPhoneNumberInput from '../MuiPhoneNumberInput';
import CustomDialogueContent from './CustomDialogueContent';
import { auth } from '../../utlis/firebase-config';
import { LoginModalPageContext } from './LoginModalPageContext';

function getInputPropsFrom(phoneNumber) {
  const error = !isPossiblePhoneNumber(phoneNumber);
  return {
    error,
    helperText: error ? 'Enter a valid Phone number' : '',
  };
}

const noAlertConfig = {
  show: false,
  textContent: '',
  success: null,
};

export default function SignInWithPhoneNumberPage() {
  const [phoneNumberVal, setPhoneNumberVal] = useState('');
  const [OTPValue, setOTPValue] = useState('');
  const [errorChecking, setErrorChecking] = useState(false);
  const [phoneInputProps, setPhoneInputProps] = useState({
    error: false,
    helperText: '',
  });
  const [endAlert, setEndAlert] = useState(noAlertConfig);

  useEffect(() => {
    if (errorChecking) {
      const newPhoneInputProps = getInputPropsFrom(phoneNumberVal);
      setPhoneInputProps(newPhoneInputProps);
    }
  }, [errorChecking, phoneNumberVal]);

  const [showOTPScreen, setShowOTPScreen] = useState(false);

  /* Handle Submit */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = () => {
    if (!isPossiblePhoneNumber(phoneNumberVal)) {
      setErrorChecking(true);
      return;
    }
    // else submit form
    setIsSubmitting(true);
    const recaptchaVerifier = new RecaptchaVerifier(
      'submitPhoneNumber',
      {
        size: 'invisible',
      },
      auth
    );
    signInWithPhoneNumber(auth, phoneNumberVal, recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Now verify the OTP.
        window.confirmationResult = confirmationResult;
        setShowOTPScreen(true);
      })
      .catch((err) => {
        setEndAlert({
          show: true,
          textContent: err.message,
          success: false,
        });
      })
      .finally(() => setIsSubmitting(false));
  };
  const { onClose } = useContext(LoginModalPageContext);
  const confirmOTP = () => {
    setIsSubmitting(true);
    window.confirmationResult
      .confirm(OTPValue)
      .then(onClose)
      .catch((err) => {
        setEndAlert({
          show: true,
          textContent: err.message,
          success: false,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <CustomDialogueContent
      heading="Sign in With Your Phone Number"
      withBackButton
    >
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
        {showOTPScreen ? (
          <TextField
            required
            label="Enter OTP"
            placeholder="123456"
            value={OTPValue}
            onChange={(e) => setOTPValue(e.target.value)}
            sx={{ display: 'block' }}
          />
        ) : (
          <MuiPhoneNumberInput
            label="Enter Phone Number"
            required
            helperText={phoneInputProps.helperText}
            error={phoneInputProps.error}
            value={phoneNumberVal}
            onChange={(newVal) => setPhoneNumberVal(newVal)}
            sx={{ display: 'block' }}
          />
        )}
        <Button
          variant="contained"
          size="large"
          disabled={isSubmitting}
          onClick={showOTPScreen ? confirmOTP : handleSubmit}
          id={showOTPScreen ? 'submitOTP' : 'submitPhoneNumber'}
        >
          Submit
        </Button>
      </form>
    </CustomDialogueContent>
  );
}
