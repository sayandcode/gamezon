import { Box, RadioGroup, styled, useRadioGroup } from '@mui/material';
import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import ScrollbarStyles from './ScrollbarStyles';

function ScrollingSelect({
  name,
  children,
  value,
  onChange: handleChange,
  spacing,
}) {
  return (
    <Box
      direction="row"
      sx={{
        overflowX: 'auto',
        p: 4,
        bgcolor: 'grey.100',
        position: 'relative',
        // scrollbar styles
        ...ScrollbarStyles,
      }}
    >
      <Box sx={{ display: 'inline-block' }}>
        <RadioGroup
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            columnGap: spacing,
            alignItems: 'center',
          }}
          name={name}
          onChange={handleChange}
          value={value}
        >
          {children.map((child) => (
            <LabelOnlyRadioButton
              key={child.props.id}
              id={child.props.id}
              value={child.props.value}
              label={child}
            />
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );
}

ScrollingSelect.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ScrollingSelect.defaultProps = {
  value: undefined,
  onChange: () => {},
  spacing: 2,
};

export default ScrollingSelect;

function LabelOnlyRadioButton({ id, value, label }) {
  if (!Object.hasOwn(label.props, 'selected'))
    console.warn(
      "LabelOnlyRadioButton was given a child which doesn't have selected prop. Add it to show differing styles when selected",
      label
    );
  const radioGroup = useRadioGroup();

  let selected = false;
  if (radioGroup) {
    selected = radioGroup.value === value;
  }

  return (
    <StyleWrapper>
      <input
        type="radio"
        id={id}
        name={radioGroup.name}
        value={value}
        onChange={radioGroup.onChange}
        checked={selected}
      />
      <label htmlFor={id}>{cloneElement(label, { selected })}</label>
    </StyleWrapper>
  );
}

LabelOnlyRadioButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  label: PropTypes.node,
};

LabelOnlyRadioButton.defaultProps = {
  id: undefined,
  value: undefined,
  label: undefined,
};

const StyleWrapper = styled('div')(({ theme }) => ({
  'input[type="radio"]': {
    position: 'absolute',
    // opacity: 0,
    '&:focus-visible + label': {
      display: 'block',
      outline: `3px dashed ${theme.palette.secondary.light}`,
      outlineOffset: theme.spacing(1),
    },
  },
}));
