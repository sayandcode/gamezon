import { Button, darken } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { auth } from '../../utlis/firebase-config';
import { LoginModalPageContext } from './LoginModalPageContext';

export default function SignInWithGoogleButton({ size }) {
  const { onClose } = useContext(LoginModalPageContext);

  const handleSignInWithGoogleButtonClick = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(onClose)
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
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
      size={size}
      onClick={handleSignInWithGoogleButtonClick}
    >
      Sign in with Google
    </Button>
  );
}

SignInWithGoogleButton.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

SignInWithGoogleButton.defaultProps = {
  size: 'medium',
};
