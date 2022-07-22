import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  keyframes,
  Skeleton,
  Typography,
} from '@mui/material';
import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { getDataFromQuery } from '../../utlis/DBHandlers/MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production
import { ImageCarouselItem } from '../../utlis/DBHandlers/DBDataConverter';
import { GameDatabaseQuery } from '../../utlis/DBHandlers/DBQueryClasses';
import { NotificationSnackbarContext } from '../../utlis/Contexts/NotificationSnackbarContext';

const CAROUSEL_HEIGHT = '200px';

const scroll = keyframes`
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(-100%) translateY(${CAROUSEL_HEIGHT});
  }
`;

export default function ImageCarousel({ itemsQuery }) {
  const navigate = useNavigate();

  const [carouselItems, setCarouselItems] = useState([{}]);
  // load carousel items
  const { showNotificationWith } = useContext(NotificationSnackbarContext);
  useEffect(() => {
    (async () => {
      let queriedItems;
      try {
        queriedItems = await getDataFromQuery(itemsQuery);
      } catch (err) {
        showNotificationWith({
          message: 'Something went wrong. Please refresh the page.',
          variant: 'error',
        });
      }
      const newCarouselItems = await Promise.allSettledFiltered(
        queriedItems.map(async (item) => ImageCarouselItem.createFrom(item))
      );
      setCarouselItems(newCarouselItems.length ? newCarouselItems : [{}]);
    })();
  }, []);

  // unload carousel Images
  // clean up the imgBlob URLs to prevent memory leak
  useEffect(() => {
    return () => carouselItems.forEach((item) => item.dispose?.());
  }, [carouselItems]);

  const [currItemIndex, setCurrItemIndex] = useState(0);
  const changePic = ({ rightDir }) => {
    const itemCount = carouselItems.length;
    setCurrItemIndex((oldIndex) => {
      const newIndex = rightDir ? oldIndex + 1 : oldIndex - 1;
      const circularIndex = (newIndex + itemCount) % itemCount;
      return circularIndex;
    });
  };

  // automatic switching interval
  const intervalRef = useRef(null);
  const startCarouselSwitching = () => {
    clearInterval(intervalRef.current);
    const newIntervalRef = setInterval(() => {
      changePic({ rightDir: true });
    }, 5000);
    intervalRef.current = newIntervalRef;
  };
  const pauseCarouselSwitching = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startCarouselSwitching();
    return pauseCarouselSwitching;
  }, [carouselItems]);

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
      onMouseEnter={pauseCarouselSwitching}
      onMouseLeave={startCarouselSwitching}
      onFocus={pauseCarouselSwitching}
      onBlur={startCarouselSwitching}
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
        boxArtSrc={carouselItems[currItemIndex].boxArtUrl}
        onClick={() =>
          navigate(
            `/product/${encodeURIComponent(carouselItems[currItemIndex].title)}`
          )
        }
      />
      {carouselItems[currItemIndex].bgImgUrl ? (
        <Box
          component="img"
          src={carouselItems[currItemIndex].bgImgUrl}
          alt=""
          sx={{
            zIndex: 1,
            width: '100%',
            animation: `${scroll} 30s linear infinite alternate`,
          }}
        />
      ) : (
        <Skeleton
          height={CAROUSEL_HEIGHT}
          variant="rectangular"
          sx={{
            bgcolor: 'black',
          }}
        />
      )}
    </Box>
  );
}

ImageCarousel.propTypes = {
  itemsQuery: PropTypes.instanceOf(GameDatabaseQuery).isRequired,
};

function InfoOverlay({ title, description, boxArtSrc, onClick }) {
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
        {boxArtSrc ? (
          <Box
            component="img"
            src={boxArtSrc}
            sx={{ height: `calc(${CAROUSEL_HEIGHT}/1.5)` }}
          />
        ) : (
          <Skeleton
            sx={{
              height: `calc(${CAROUSEL_HEIGHT}/1.5)`,
              width: '100px',
              bgcolor: 'white',
            }}
          />
        )}
        <div style={{ color: 'white' }}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="subtitle2">{description}</Typography>
        </div>
      </Box>
    </Box>
  );
}

InfoOverlay.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  boxArtSrc: PropTypes.string,
  onClick: PropTypes.func,
};

InfoOverlay.defaultProps = {
  title: 'Loading...',
  description: 'Loading...',
  boxArtSrc: '',
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
