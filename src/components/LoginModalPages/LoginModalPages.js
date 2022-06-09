import { Google as GoogleIcon } from '@mui/icons-material';
import { Button, darken, Stack } from '@mui/material';
import { useContext, useState } from 'react';
import Logo from '../Logo';
import MuiPhoneNumberInput from '../MuiPhoneNumberInput';
import CustomDialogueContent from './CustomDialogueContent';
import { LoginModalContext } from './LoginModalContext';

export function MainLoginPage() {
  const { setCurrPage } = useContext(LoginModalContext);

  return (
    <CustomDialogueContent
      heading={
        <>
          Login to <Logo variant="h5" component="div" />
        </>
      }
    >
      <Stack spacing={2}>
        <Button
          variant="outlined"
          sx={{
            bgcolor: '#4285f4',
            color: 'white',
            '&:hover': {
              bgcolor: darken('#4285f4', 0.2),
            },
          }}
          startIcon={<GoogleIcon />}
          size="large"
        >
          Sign in with Google
        </Button>
        <Button
          variant="outlined"
          onClick={() => setCurrPage('signInWithPhoneNumber')}
          size="large"
        >
          Sign in with Phone Number
        </Button>
        <Button
          variant="outlined"
          onClick={() => setCurrPage('signInWithEmail')}
          size="large"
        >
          Sign in with Email
        </Button>
      </Stack>
    </CustomDialogueContent>
  );
}

export function SignInWithPhoneNumberPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <CustomDialogueContent
      heading={<>Sign in With Your Phone Number</>}
      withBackButton
    >
      <div style={{ textAlign: 'center' }}>
        <MuiPhoneNumberInput onChange={(newVal) => setPhoneNumber(newVal)} />
      </div>
      <Button
        variant="contained"
        size="large"
        sx={{ my: 2, marginInline: '50%', transform: 'translateX(-50%)' }}
      >
        Submit
      </Button>
    </CustomDialogueContent>
  );
}

export function SignInWithEmail() {
  return (
    <CustomDialogueContent
      heading={<>Sign in With Your Email</>}
      withBackButton
    >
      <Button variant="outlined">Sign in with Email</Button>
    </CustomDialogueContent>
  );
}
