import { Close as CloseIcon } from '@mui/icons-material';
import { Box, IconButton, Modal } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

function CurrImgViewer({ imgUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          border: (theme) => `2px solid ${theme.palette.divider}`,
          cursor: 'zoom-in',
        }}
        onClick={() => setIsOpen(true)}
        aria-label="Current Game Screenshot"
      />
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="Game Screenshot Image Modal"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            outline: 'none',
          }}
        >
          <Box
            component="img"
            src={imgUrl}
            alt="Game Screenshot"
            sx={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              borderRadius: (theme) => theme.shape.borderRadius,
            }}
          />
          <IconButton
            sx={{
              position: 'fixed',
              top: '0',
              right: '0',
              color: 'white',
              m: 4,
              '&:hover, &:focus': {
                opacity: (theme) => 1 - theme.palette.action.activatedOpacity,
              },
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
}

CurrImgViewer.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};

export default CurrImgViewer;
