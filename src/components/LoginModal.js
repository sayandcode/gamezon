import { PropTypes } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useMeasure from 'react-use-measure';
import { Modal, Paper } from '@mui/material';
import MainLoginPage from './LoginModalPages/MainLoginPage';
import { LoginModalContextProvider } from './LoginModalPages/LoginModalContext';
import customTheme from '../CustomTheme';
import SignInWithPhoneNumberPage from './LoginModalPages/SignInWithPhoneNumberPage';
import SignInWithEmail from './LoginModalPages/SignInWithEmailPage';

const pageContent = {
  mainLogin: <MainLoginPage />,
  signInWithPhoneNumber: <SignInWithPhoneNumberPage />,
  signInWithEmail: <SignInWithEmail />,
};

const ModalContentAnimationVariants = {
  enter: (direction) => ({ x: `${direction * 100}%` }),
  centered: {
    x: 0,
    transition: {
      ease: 'easeInOut',
      duration: (customTheme.transitions.duration.leavingScreen * 2.5) / 1000,
    },
  },
  exit: (direction) => ({
    x: `${direction * -100}%`,
    transition: {
      ease: 'easeInOut',
      duration: (customTheme.transitions.duration.leavingScreen * 2.5) / 1000,
    },
  }),
};

export default function LoginModal({ open, onClose }) {
  const [currPage, setCurrPage] = useState('mainLogin');
  const [
    ModalContentRef,
    { width: ModalContentWidth, height: ModalContentHeight },
  ] = useMeasure();
  const ModalPaperRef = useRef();

  /* PREVENT ANIMATION ON WINDOW RESIZE */
  const [resizing, setResizing] = useState(false);
  useEffect(() => {
    let timeoutRef;
    function SetResizingState() {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      } else setResizing(true);
      timeoutRef = setTimeout(() => setResizing(false), 100);
    }
    window.addEventListener('resize', SetResizingState);
  }, []);
  /* PREVENT ANIMATION ON WINDOW RESIZE */

  /* TRACK FIRST MOUNT */
  const [firstMount, setFirstMount] = useState(true);
  useEffect(() => {
    setFirstMount(false);
  }, []);
  /* TRACK FIRST MOUNT */

  const swipeDirection = currPage === 'mainLogin' ? -1 : 1;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-login"
      aria-describedby="modal-login-options"
    >
      <Paper
        sx={{
          outline: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
          transitionProperty: 'all',
          transitionDuration: (theme) =>
            `${theme.transitions.duration.enteringScreen}ms`,
          transitionTimingFunction: (theme) =>
            `${theme.transitions.easing.easeIn}`,
        }}
        style={{
          height: ModalContentHeight || 'auto',
          width: ModalContentWidth || 'auto',
          transition: resizing ? 'none' : '',
        }}
        ref={ModalPaperRef}
      >
        <LoginModalContextProvider value={{ setCurrPage, onClose }}>
          <AnimatePresence custom={swipeDirection}>
            <motion.div
              key={currPage}
              variants={ModalContentAnimationVariants}
              initial={firstMount ? false : 'enter'}
              animate="centered"
              exit="exit"
              custom={swipeDirection}
              style={{ position: 'absolute' }}
              ref={ModalContentRef}
            >
              {pageContent[currPage]}
            </motion.div>
          </AnimatePresence>
        </LoginModalContextProvider>
      </Paper>
    </Modal>
  );
}

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
