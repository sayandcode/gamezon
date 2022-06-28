import { useContext } from 'react';
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { LoginModalContext } from './LoginModalContext';

export default function CustomDialogueContent({
  withBackButton,
  heading,
  children,
}) {
  const { setCurrPage, onClose } = useContext(LoginModalContext);

  return (
    <Box
      sx={{
        ml: withBackButton ? 5 : 3,
        mr: 3,
        mt: 1,
        mb: 2,
        minWidth: '30vw',
        minHeight: '30vh',
        maxWidth: '50vw',
      }}
    >
      <Stack direction="row" mb={1} alignItems="center">
        {withBackButton && (
          <IconButton
            edge="start"
            sx={{ ml: -5 }}
            onClick={() => setCurrPage('mainLogin')}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="h2">
          {heading}
        </Typography>
        <IconButton edge="end" sx={{ ml: 'auto' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}

CustomDialogueContent.propTypes = {
  withBackButton: PropTypes.bool,
  heading: PropTypes.node.isRequired,
  children: PropTypes.node,
};

CustomDialogueContent.defaultProps = {
  withBackButton: false,
  children: null,
};
