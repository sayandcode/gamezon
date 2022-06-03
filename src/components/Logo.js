import { Typography } from '@mui/material';
import '@fontsource/racing-sans-one';
import PropTypes from 'prop-types';

export default function Logo(props) {
  // eslint-disable-next-line react/prop-types
  const { sx, ...restProps } = props;
  return (
    <Typography
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
      sx={{
        ...sx,
        fontFamily: 'Racing Sans One, cursive',
      }}
    >
      Gamezon
    </Typography>
  );
}
