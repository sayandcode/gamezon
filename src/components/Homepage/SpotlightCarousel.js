import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Box, IconButton, keyframes, Typography } from '@mui/material';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { TodaysOffersContext } from '../../utlis/Contexts/TodaysOffersContext';

const CAROUSEL_HEIGHT = '200px';

const scroll = keyframes`
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(-100%) translateY(${CAROUSEL_HEIGHT});
  }
`;

function SpotlightCarousel() {
  // const { spotlightItems } = useContext(TodaysOffersContext);

  return (
    <Box
      sx={{
        height: CAROUSEL_HEIGHT,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          img: {
            animationPlayState: 'paused',
          },
          '.InfoOverlay::before': {
            opacity: 0.5,
          },
          '.InfoOverlayContentContainer': {
            opacity: 1,
          },
        },
      }}
    >
      <CarouselControls />
      <InfoOverlay />
      <Box
        component="img"
        src="2.png"
        alt=""
        sx={{
          zIndex: 1,
          width: '100%',
          // animation: `${scroll} 30s linear infinite alternate`,
        }}
      />
    </Box>
  );
}

export default SpotlightCarousel;

function InfoOverlay() {
  return (
    <Box
      className="InfoOverlay"
      sx={{
        '&::before': {
          content: '""',
          bgcolor: 'black',
          zIndex: 9,
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0,
          transition: (theme) =>
            `opacity ${theme.transitions.duration.short}ms`,
        },

        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        className="InfoOverlayContentContainer"
        sx={{
          opacity: 0,
          zIndex: 10,
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="boxArt.png"
          sx={{ height: `calc(${CAROUSEL_HEIGHT}/1.5)` }}
        />
        <div style={{ color: 'white' }}>
          <Typography variant="h4">Game Title</Typography>
          <Typography variant="subtitle2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore,
            architecto?
          </Typography>
        </div>
      </Box>
    </Box>
  );
}

function CarouselControls() {
  return (
    <>
      <CarouselIconButton position="left">
        <ChevronLeftIcon />
      </CarouselIconButton>
      <CarouselIconButton position="right">
        <ChevronRightIcon />
      </CarouselIconButton>
    </>
  );
}

function CarouselIconButton({ children, position }) {
  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [position]: '1rem',
        zIndex: 11,

        '&.MuiIconButton-root': {
          color: 'white',
          '& svg': {
            fontSize: '2rem',
          },
        },
      }}
      size="large"
    >
      {children}
    </IconButton>
  );
}

CarouselIconButton.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.string.isRequired,
};
