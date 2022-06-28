import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, keyframes, Typography } from '@mui/material';
import React, { useContext, useState, useRef, useEffect } from 'react';
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
  const carouselItems = [
    {
      img: '1.png',
      title: 'Title 1',
      description: 'Description for the first one',
    },
    {
      img: '2.png',
      title: 'Title 2',
      description:
        'Description for the second one. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, doloremque!',
    },
    {
      img: '3.png',
      title: 'Title 3',
      description: 'Description for the third one',
    },
  ];

  const [currItemIndex, setCurrItemIndex] = useState(0);
  const changePic = ({ rightDir }) => {
    const itemCount = carouselItems.length;

    setCurrItemIndex((oldIndex) => {
      const newIndex = rightDir ? oldIndex + 1 : oldIndex - 1;
      const circularIndex = (newIndex + itemCount) % itemCount;
      return circularIndex;
    });
  };

  const [intervalRef, setIntervalRef] = useState(null);
  useEffect(() => {
    const newIntervalRef = setInterval(
      () => changePic({ rightDir: true }),
      5000
    );
    setIntervalRef(newIntervalRef);
  }, []);

  return (
    <Box
      sx={{
        height: CAROUSEL_HEIGHT,
        overflow: 'hidden',
        position: 'relative',
        '&:hover, &:focus-within': {
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
      onMouseEnter={() => {
        clearInterval(intervalRef);
        setIntervalRef(null);
      }}
      onMouseLeave={() => {
        const newIntervalRef = setInterval(
          () => changePic({ rightDir: true }),
          5000
        );
        setIntervalRef(newIntervalRef);
      }}
    >
      <CarouselControls
        changePic={changePic}
        currItemIndex={currItemIndex}
        setCurrItemIndex={setCurrItemIndex}
        itemCount={carouselItems.length}
      />
      <InfoOverlay
        title={carouselItems[currItemIndex].title}
        description={carouselItems[currItemIndex].description}
        onClick={() => console.log(`Clicked ${currItemIndex}`)}
      />
      <Box
        component="img"
        src={carouselItems[currItemIndex].img}
        alt=""
        sx={{
          zIndex: 1,
          width: '100%',
          animation: `${scroll} 30s linear infinite alternate`,
        }}
      />
    </Box>
  );
}

export default SpotlightCarousel;

function InfoOverlay({ title, description, onClick }) {
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
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box
        className="InfoOverlayContentContainer"
        sx={{
          opacity: 0,
          zIndex: 10,
          display: 'flex',
          gap: 5,
          alignItems: 'center',
          maxWidth: '70%',
          marginInline: '25% 10%',
        }}
      >
        <Box
          component="img"
          src="boxArt.png"
          sx={{ height: `calc(${CAROUSEL_HEIGHT}/1.5)` }}
        />
        <div style={{ color: 'white' }}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="subtitle2">{description}</Typography>
        </div>
      </Box>
    </Box>
  );
}

InfoOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClick: PropTypes.func,
};

InfoOverlay.defaultProps = {
  description: '',
  onClick: () => {},
};

function CarouselControls({
  changePic,
  currItemIndex,
  setCurrItemIndex,
  itemCount,
}) {
  return (
    <>
      <CarouselIconButton
        position="left"
        onClick={() => changePic({ rightDir: false })}
      >
        <ChevronLeftIcon />
      </CarouselIconButton>
      <CarouselIconButton
        position="right"
        onClick={() => changePic({ rightDir: true })}
      >
        <ChevronRightIcon />
      </CarouselIconButton>
      <CarouselPagination
        setCurrItemIndex={setCurrItemIndex}
        currItemIndex={currItemIndex}
        itemCount={itemCount}
      />
    </>
  );
}

CarouselControls.propTypes = {
  changePic: PropTypes.func.isRequired,
  currItemIndex: PropTypes.number.isRequired,
  setCurrItemIndex: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
};

function CarouselIconButton({ children, position, onClick }) {
  const buttonRef = useRef(null);
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
      ref={buttonRef}
      onClick={() => {
        onClick();
        buttonRef.current.blur(); // dont require the user to manually click away from the carousel
      }}
    >
      {children}
    </IconButton>
  );
}

CarouselIconButton.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

CarouselIconButton.defaultProps = {
  onClick: () => {},
};

function CarouselPagination({ itemCount, currItemIndex, setCurrItemIndex }) {
  const pageRef = useRef(
    Array.from(Array(itemCount).keys()).map(() => React.createRef())
  );

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 11,
        bottom: (theme) => theme.spacing(2),
        left: '50%',
        transform: 'translateX(-50%)',

        display: 'flex',
        gap: 1,
      }}
    >
      {Array.from(Array(itemCount).keys()).map((_, i) => (
        <IconButton
          disableRipple
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          size="small"
          ref={pageRef.current[i]}
          sx={{
            bgcolor: currItemIndex === i ? 'red' : 'white',
            '&:hover': {
              bgcolor: (theme) => theme.palette.secondary.light,
            },
          }}
          onClick={() => {
            setCurrItemIndex(i);
            pageRef.current[i].current.blur();
          }}
        />
      ))}
    </Box>
  );
}

CarouselPagination.propTypes = {
  itemCount: PropTypes.number.isRequired,
  currItemIndex: PropTypes.number.isRequired,
  setCurrItemIndex: PropTypes.func.isRequired,
};
