import {
  Close,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Modal,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState, useRef, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ProductPageItem } from '../utlis/DBHandlers/DBDataConverter';
import { GameDatabaseQuery } from '../utlis/DBHandlers/DBQueryClasses';
import { getDataFromQuery } from '../utlis/DBHandlers/MockDBFetch';
import { UserContext } from '../utlis/Contexts/UserData/UserContext';
import { NotificationSnackbarContext } from '../utlis/Contexts/NotificationSnackbarContext';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState();
  const [currVariant, setCurrVariant] = useState();

  let currPrice = product?.variants[currVariant].price;
  if (currPrice === null) currPrice = 'Unreleased';
  const disableButtons = !product || currPrice === 'Unreleased';
  const { buyNow, addToCart, toggleWishlist } = useContext(UserContext);

  const { showNotificationWith } = useContext(NotificationSnackbarContext);
  useEffect(() => {
    const q = new GameDatabaseQuery().where('title', '==', params.productName);
    (async () => {
      let queriedItem;
      try {
        [queriedItem] = await getDataFromQuery(q);
      } catch {
        showNotificationWith({
          message: 'Something went wrong. Please refresh the page.',
          variant: 'error',
        });
      }

      const pageItem = await ProductPageItem.createFrom(queriedItem);
      setProduct(pageItem);
      setCurrVariant(Object.keys(pageItem.variants)[0]);
    })();
  }, []);

  // dispose of the data when component is unmounted
  useEffect(() => () => product?.dispose(), [product]);

  return (
    <Stack m={2} spacing={2}>
      <Paper
        sx={{
          p: 4,
          display: 'grid',
          gridTemplateColumns: '1.5fr 2fr',
        }}
      >
        {product ? (
          <ImageViewer
            imgUrls={product.imgUrls}
            trailerUrl={product.trailerUrl}
          />
        ) : (
          <Skeleton
            sx={{
              width: '80%',
              height: '100%',
              mx: 'auto',
            }}
          />
        )}
        <Box sx={{ color: (theme) => theme.palette.text.secondary }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            {params.productName}
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1} mb={2}>
            <Typography variant="subtitle1">Genre:</Typography>
            {product ? (
              product.genres.map((genreName) => (
                <Chip
                  label={genreName}
                  key={genreName}
                  component={Link}
                  onClick={() => {}} // its already a link, so why bother. onClick is just for style
                  to={`/byCategory/genre/${genreName}`}
                />
              ))
            ) : (
              <Skeleton width="100%">
                <Chip />
              </Skeleton>
            )}
          </Stack>
          {product ? (
            <ProductVariantsToggleButton
              value={currVariant}
              variants={Object.keys(product.variants)}
              onChange={(_, newVariant) =>
                setCurrVariant((oldVariant) => newVariant || oldVariant)
              }
            />
          ) : (
            <Skeleton sx={{ mb: 2 }}>
              <ToggleButton sx={{ width: '500px', display: 'block' }} value="">
                Lorem
              </ToggleButton>
            </Skeleton>
          )}
          <Typography variant="h6" display="inline">
            Price:
          </Typography>
          <Typography
            variant="h4"
            color="text.primary"
            fontWeight="bold"
            ml={4}
            gutterBottom
            width={200}
          >
            {product ? currPrice : <Skeleton />}
          </Typography>

          <Stack spacing={2} direction="row">
            <Button
              disabled={disableButtons}
              size="large"
              variant="contained"
              color="secondary"
              onClick={() => buyNow(product.title)}
            >
              Buy Now
            </Button>
            <Button
              disabled={disableButtons}
              size="large"
              variant="contained"
              color="primary"
              onClick={() => addToCart(product.title)}
            >
              Add to cart
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="primary"
              onClick={() => toggleWishlist(product.title)}
            >
              Toggle wishlist
            </Button>
          </Stack>
        </Box>
      </Paper>
      {product && <ProductDescription content={product.description} />}
    </Stack>
  );
}

function ProductVariantsToggleButton({ value, onChange, variants }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="text alignment"
      sx={{ mb: 2, display: 'block' }}
    >
      {variants.map((variantName) => (
        <ToggleButton value={variantName} key={variantName}>
          {variantName}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

ProductVariantsToggleButton.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  variants: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ImageViewer({ imgUrls, trailerUrl }) {
  const videoID = trailerUrl && trailerUrl.match(/watch\?v=(.*)/)[1];
  const items = [
    {
      isVideo: true,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoID}/sddefault.jpg`,
    },
    ...imgUrls.map((url) => ({ thumbnailUrl: url })),
  ];
  const [currItem, setCurrItem] = useState(items[0]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '1fr 50px',
        rowGap: '1em',
        justifyItems: 'center',
        width: '80%',
        justifySelf: 'center',
      }}
    >
      {currItem.isVideo ? (
        <iframe
          style={{ width: '100%', height: '100%' }}
          src={`https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <CurrImgViewer imgUrl={currItem.thumbnailUrl} />
      )}

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          bgcolor: (theme) => theme.palette.grey[200],
        }}
      >
        {items.map((item) => (
          <Box
            sx={{
              width: '50px',
              backgroundImage: `url(${item.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              outline: (theme) =>
                `2px solid ${
                  item.thumbnailUrl === currItem.thumbnailUrl
                    ? theme.palette.action.active
                    : theme.palette.action.disabled
                }`,
              cursor: 'pointer',
              '&:focus, &:hover': {
                outlineWidth: '5px',
                outlineOffset: '-5px',
              },
            }}
            tabIndex={0}
            key={item.thumbnailUrl}
            onClick={() => setCurrItem(item)}
          />
        ))}
      </Box>
    </Box>
  );
}

ImageViewer.propTypes = {
  imgUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  trailerUrl: PropTypes.string,
};

ImageViewer.defaultProps = {
  trailerUrl: null,
};

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
            <Close />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
}

CurrImgViewer.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};

function ProductDescription({ content }) {
  const [collapsed, setCollapsed] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const DescriptionRef = useRef();
  useEffect(() => {
    const { clientHeight, scrollHeight } = DescriptionRef.current;
    if (clientHeight !== scrollHeight) setShowButton(true);
  }, []);

  const buttonContent = collapsed ? (
    <>
      Read More <ExpandMoreIcon />
    </>
  ) : (
    <>
      Read Less <ExpandLessIcon />
    </>
  );

  return (
    <Paper sx={{ px: 4, py: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Description
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: collapsed ? '2' : '40',
          overflow: 'hidden',
          maxHeight: collapsed ? '3em' : '40em',
          transition: 'all 2s',
        }}
        ref={DescriptionRef}
      >
        {content}
      </Typography>
      {showButton && (
        <Button
          variant="text"
          sx={{ display: 'flex', ml: 'auto' }}
          onClick={() => setCollapsed((old) => !old)}
        >
          {buttonContent}
        </Button>
      )}
    </Paper>
  );
}

ProductDescription.propTypes = {
  content: PropTypes.string.isRequired,
};
