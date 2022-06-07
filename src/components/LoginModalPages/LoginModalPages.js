import { Button } from '@mui/material';
import { useContext } from 'react';
import Logo from '../Logo';
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
      <Button
        variant="outlined"
        onClick={() => setCurrPage('signInWithPhoneNumber')}
      >
        Sign in with Email
      </Button>
      <Button variant="outlined">Sign in with Email</Button>
      <Button variant="outlined">Sign in with Email</Button>
      <Button variant="outlined">Sign in with Email</Button>
      <Button variant="outlined">Sign in with Email</Button>
    </CustomDialogueContent>
  );
}

export function SignInWithPhoneNumberPage() {
  const { setCurrPage } = useContext(LoginModalContext);

  return (
    <CustomDialogueContent
      heading={<>Sign in With Your Phone Number</>}
      withBackButton
    >
      <Button variant="outlined" onClick={() => setCurrPage('mainLogin')}>
        Sign in with Email
      </Button>
    </CustomDialogueContent>
  );
}
