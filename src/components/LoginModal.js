import { useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useMeasure from 'react-use-measure';
import { Modal, Paper } from '@mui/material';
import { LoginModalPageContextProvider } from './LoginModalPages/LoginModalPageContext';
import customTheme from '../CustomTheme';
import MainLoginPage from './LoginModalPages/MainLoginPage';
import SignInWithPhoneNumberPage from './LoginModalPages/SignInWithPhoneNumberPage';
import SignInWithEmail from './LoginModalPages/SignInWithEmailPage';
import { LoginModalContext } from '../utlis/Contexts/LoginModalContext';

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

export default function LoginModal() {
  const { open, onClose } = useContext(LoginModalContext);
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
  // When the modal is opened, behave as if it has been mounted for the first time.
  const [firstMount, setFirstMount] = useState(true);
  useEffect(() => {
    setFirstMount(!open);
    setCurrPage('mainLogin');
  }, [open]);
  /* TRACK FIRST MOUNT */

  const swipeDirection = currPage === 'mainLogin' ? -1 : 1;

  return (
    <Modal
      open={open} // we handle the opening elsewhere as a React-style conditional &&
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
          transitionProperty: 'height',
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
        <LoginModalPageContextProvider value={{ setCurrPage, onClose }}>
          <AnimatePresence custom={swipeDirection}>
            <motion.div
              key={currPage}
              variants={ModalContentAnimationVariants}
              initial={!firstMount && 'enter'}
              animate="centered"
              exit="exit"
              custom={swipeDirection}
              style={{ position: 'absolute' }}
              ref={ModalContentRef}
            >
              {pageContent[currPage]}
            </motion.div>
          </AnimatePresence>
        </LoginModalPageContextProvider>
      </Paper>
    </Modal>
  );
}
