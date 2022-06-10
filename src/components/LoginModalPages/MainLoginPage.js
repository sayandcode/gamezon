import { Google as GoogleIcon } from '@mui/icons-material';
import { Button, darken, Stack } from '@mui/material';
import { useContext } from 'react';
import Logo from '../Logo';
import CustomDialogueContent from './CustomDialogueContent';
import { LoginModalContext } from './LoginModalContext';

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
