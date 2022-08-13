import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  keyframes,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState, useRef, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { getDataFromQuery } from '../../utlis/DBHandlers/MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production
import { ImageCarouselItem } from '../../utlis/DBHandlers/DBDataConverter';
import { GameDatabaseQuery } from '../../utlis/DBHandlers/DBQueryClasses';
import { promiseToResource } from '../../utlis/SuspenseHelpers';
import { GameDatabase } from '../../utlis/DBHandlers/DBManipulatorClasses';
import ErrorMessage from '../ErrorMessage';

const CAROUSEL_HEIGHT = '200px';

const scroll = keyframes`
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(-100%) translateY(${CAROUSEL_HEIGHT});
  }
`;

export default function ImageCarousel({ items }) {
  /* PROVIDE ITEMRESOURCE FOR SUSPENSE */
  const [itemsResource, setItemResource] = useState(
    // perpetual promise as initial value of item resource, guarantees suspense fallback on first render
    promiseToResource(new Promise(() => {}))
  );
  useEffect(updateItemResource, [items]);
  function updateItemResource() {
    setItemResource(promiseToResource(getNewCarouselItems()));
  }

  async function getNewCarouselItems() {
    const queriedItems = await getDataFromDB();
    const newCarouselItems = await Promise.allSettledFiltered(
      queriedItems.map(async (item) => ImageCarouselItem.createFrom(item))
    );
    return newCarouselItems;

    async function getDataFromDB() {
      if (items instanceof GameDatabaseQuery) {
        return getDataFromQuery(items);
      }
      if (Array.isArray(items)) {
        return Promise.all(
          items.map(async (title) => GameDatabase.get({ title }))
        );
      }
      throw new Error('Items is neither a query or a predetermined list');
    }
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense
        fallback={
          <Skeleton
            height={CAROUSEL_HEIGHT}
            variant="rectangular"
            sx={{
              bgcolor: 'black',
            }}
          />
        }
      >
        <Carousel resource={itemsResource} />
      </Suspense>
    </ErrorBoundary>
  );
}

ImageCarousel.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.instanceOf(GameDatabaseQuery),
    PropTypes.array,
  ]).isRequired,
};

function ErrorFallback() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width="100%"
      height={CAROUSEL_HEIGHT}
      backgroundColor="black"
    >
      <ErrorMessage />
    </Stack>
  );
}

function Carousel({ resource }) {
  /* RESOURCE HANDLING */
  const carouselItems = resource.read();

  /* UNLOAD CAROUSEL IMAGES */
  // clean up the imgBlob URLs to prevent memory leak
  useEffect(() => {
    return () => carouselItems.forEach((item) => item.dispose?.());
  }, [resource]);

  /* CURRENT INDEX */
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
  }, [resource]);

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
      />
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
    </Box>
  );
}

Carousel.propTypes = {
  resource: PropTypes.shape({ read: PropTypes.func }).isRequired,
};

function InfoOverlay({ title, description, boxArtSrc }) {
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
        textDecoration: 'none',
      }}
      component={Link}
      to={`product/${encodeURIComponent(title)}`}
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
          src={boxArtSrc}
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
  description: PropTypes.string.isRequired,
  boxArtSrc: PropTypes.string.isRequired,
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
