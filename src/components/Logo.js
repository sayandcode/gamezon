import { Typography } from '@mui/material';
import '@fontsource/racing-sans-one';
import PropTypes from 'prop-types';

export default function Logo(props) {
  const { sx, ...restProps } = props;
  return (
    <Typography
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
      sx={{
        ...sx,
        fontFamily: 'Racing Sans One, cursive',
        display: 'inline-block',
      }}
    >
      Gamezon
    </Typography>
  );
}

Logo.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
};

Logo.defaultProps = {
  sx: {},
};
