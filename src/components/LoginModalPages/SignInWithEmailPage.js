import { Button } from '@mui/material';
import CustomDialogueContent from './CustomDialogueContent';

export default function SignInWithEmail() {
  return (
    <CustomDialogueContent
      heading={<>Sign in With Your Email</>}
      withBackButton
    >
      <Button variant="outlined">Sign in with Email</Button>
    </CustomDialogueContent>
  );
}
