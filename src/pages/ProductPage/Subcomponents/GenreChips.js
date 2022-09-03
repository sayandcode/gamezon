import { Chip, Skeleton } from '@mui/material';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';

function GenreChips({ productPageDataResource }) {
  const dataHandler = productPageDataResource.read();
  const { genres } = dataHandler.product;
  return genres.map((genreName) => <Chip label={genreName} key={genreName} />);
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
