import { Box, Chip, Stack, Typography } from '@mui/material';
import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { useResource } from '../../../../utlis/SuspenseHelpers';
import useDataHandler from '../../../../utlis/CustomHooks/useDataHandler';
import SearchOptionDataHandler from './Helpers/SearchOptionDataHandler';
import SearchImg, {
  SearchImgSuspenseFallback,
  SearchImgErrorFallback,
} from './Subcomponents/SearchImg';

function SearchOption({ props, option }) {
  const dataHandler = useDataHandler(new SearchOptionDataHandler());
  const imgUrlResource = useResource(() => dataHandler.getImgUrl(option), []);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <li {...props}>
      <Stack direction="row" spacing={3} px={1}>
        <ErrorBoundary fallback={<SearchImgErrorFallback />}>
          <Suspense fallback={<SearchImgSuspenseFallback />}>
            <SearchImg alt={option.title} imgUrlResource={imgUrlResource} />
          </Suspense>
        </ErrorBoundary>
        <Box>
          <Typography
            dangerouslySetInnerHTML={{ __html: option.label }}
            variant="h6"
            component="div"
            sx={{
              em: {
                fontStyle: 'inherit',
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
              },
            }}
          />
          <Typography variant="subtitle2" gutterBottom>
            {option.subtitle}
          </Typography>
          {option.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </Stack>
    </li>
  );
}

SearchOption.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.object.isRequired,
  option: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default SearchOption;
