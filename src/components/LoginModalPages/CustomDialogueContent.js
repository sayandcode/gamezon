import { useContext } from 'react';
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { LoginModalContext } from './LoginModalContext';

export default function CustomDialogueContent({
  withBackButton,
  heading,
  children,
}) {
  const { setCurrPage, onClose } = useContext(LoginModalContext);

  return (
    <Box sx={{ px: 3, pt: 1, pb: 2, minWidth: '30vw', minHeight: '30vh' }}>
      <Stack direction="row" mb={1} alignItems="center">
        {withBackButton && (
          <IconButton edge="start" onClick={() => setCurrPage('mainLogin')}>
            <ArrowBackIosNewIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div">
          {heading}
        </Typography>
        <IconButton edge="end" sx={{ ml: 'auto' }} onClose={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
      <Stack mt={2}>{children}</Stack>
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
