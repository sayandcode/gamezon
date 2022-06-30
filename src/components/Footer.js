import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        mt: 4,
        bgcolor: 'secondary.dark',
        color: 'secondary.contrastText',
        height: '100%',
        textAlign: 'center',
        paddingBlock: '1em',
      }}
    >
      <Typography
        // component="a"
        // href=""
        variant="subtitle1"
        sx={{ fontFamily: 'Racing Sans One, cursive' }}
      >
        @sayandcode &#169;2022
      </Typography>
      <div>
        <IconButton
          color="inherit"
          component="a"
          href="https://www.linkedin.com/in/sayand-sathish-aaba921b7/"
          title="Link to LinkedIn Profile"
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          color="inherit"
          component="a"
          href="https://github.com/sayandcode/gamezon"
          title="Link to Github Repo"
        >
          <GitHubIcon />
        </IconButton>
      </div>
    </Box>
  );
}
