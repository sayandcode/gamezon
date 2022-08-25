import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';

function ProductDescription({ productPageDataResource }) {
  const dataHandler = productPageDataResource.read();
  const content = dataHandler.product.description;

  /* COMPONENT STATE */
  const [collapsed, setCollapsed] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const DescriptionRef = useRef();
  useEffect(() => {
    const { clientHeight, scrollHeight } = DescriptionRef.current;
    if (clientHeight !== scrollHeight) setShowButton(true);
  }, []);

  /* RUNTIME CALCULATIONS */
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
  productPageDataResource: resourcePropType.isRequired,
};

export default ProductDescription;
