import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { Box, Skeleton, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { resourcePropType } from '../../../../../utlis/SuspenseHelpers';

function SearchImg({ alt, imgUrlResource }) {
  const imgUrl = imgUrlResource.read();
  return (
    <Box
      component="img"
      alt={alt}
      src={imgUrl}
      sx={{ width: '75px', objectFit: 'cover' }}
    />
  );
}

SearchImg.propTypes = {
  alt: PropTypes.string.isRequired,
  imgUrlResource: resourcePropType.isRequired,
};

function SearchImgSuspenseFallback() {
  return <Skeleton sx={{ height: '100px', width: '75px' }} />;
}

function SearchImgErrorFallback() {
  return (
    <Stack
      sx={{
        height: '100px',
        width: '75px',
        bgcolor: 'error.light',
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <ErrorIcon sx={{ color: 'error.contrastText' }} />
    </Stack>
  );
}

export default SearchImg;
export { SearchImgSuspenseFallback, SearchImgErrorFallback };
