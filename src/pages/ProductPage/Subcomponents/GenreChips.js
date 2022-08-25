import { Chip, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';

function GenreChips({ productPageDataResource }) {
  const dataHandler = productPageDataResource.read();
  const { genres } = dataHandler.product;
  return genres.map((genreName) => (
    <Chip
      label={genreName}
      key={genreName}
      component={Link}
      onClick={() => {}} // its already a link, so why bother. onClick is just for style
      /* TODO: MAKE THIS LINK TO SEARCH RESULTS */
      to={`/byCategory/genre/${genreName}`}
    />
  ));
}

GenreChips.propTypes = {
  productPageDataResource: resourcePropType.isRequired,
};

function GenreChipsFallback() {
  return (
    <Skeleton width="100%">
      <Chip />
    </Skeleton>
  );
}

export default GenreChips;
export { GenreChipsFallback };
