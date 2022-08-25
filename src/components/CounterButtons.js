import {
  Button,
  ButtonGroup,
  keyframes,
  Stack,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

function CounterButtons({ label, onClick, count }) {
  return (
    <ButtonGroup sx={{ mb: 2, position: 'relative' }}>
      {label && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 0,
            zIndex: 1,
            transition: 'all 2s',
            width: '100%',
            textAlign: 'center',
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            borderTopLeftRadius: (theme) => theme.shape.borderRadius,
            borderTopRightRadius: (theme) => theme.shape.borderRadius,
            animation: (theme) =>
              `${slideUp} ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut} forwards`,
          }}
        >
          {label}
        </Typography>
      )}
      <Button
        variant="contained"
        sx={{
          zIndex: 2,
        }}
        onClick={onClick.minus}
      >
        <RemoveIcon />
      </Button>
      <Stack
        justifyContent="center"
        px={2}
        sx={{
          color: 'text.primary',
          bgcolor: 'white',
          zIndex: 2,
          borderBlock: '2px solid black',
        }}
      >
        {count}
      </Stack>
      <Button
        variant="contained"
        sx={{
          zIndex: 2,
        }}
        onClick={onClick.plus}
      >
        <AddIcon />
      </Button>
    </ButtonGroup>
  );
}

CounterButtons.propTypes = {
  label: PropTypes.string,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.shape({ plus: PropTypes.func, minus: PropTypes.func })
    .isRequired,
};

CounterButtons.defaultProps = {
  label: undefined,
};

const slideUp = keyframes`
from{
  transform: translateY(0);
}
to{
  transform: translateY(-90%);
}
`;

export default CounterButtons;
