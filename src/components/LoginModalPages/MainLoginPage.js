import { Button, Stack } from '@mui/material';
import { useContext } from 'react';
import Logo from '../Logo';
import CustomDialogueContent from './CustomDialogueContent';
import { LoginModalContext } from './LoginModalContext';
import SignInWithGoogleButton from './SignInWithGoogleButton';

export default function MainLoginPage() {
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
        <SignInWithGoogleButton size="large" />
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
