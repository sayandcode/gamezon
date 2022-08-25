import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import CurrImgViewer from './CurrImgViewer';

function ImageViewer({ productPageDataResource }) {
  const dataHandler = productPageDataResource.read();
  const { trailerUrl, imgUrls } = dataHandler.product;

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
  productPageDataResource: PropTypes.shape({ read: PropTypes.func }).isRequired,
};

function ImageViewerFallback() {
  return (
    <Skeleton
      sx={{
        width: '80%',
        height: '100%',
        mx: 'auto',
      }}
    />
  );
}

export default ImageViewer;
export { ImageViewerFallback };
