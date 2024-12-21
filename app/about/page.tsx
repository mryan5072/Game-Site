import { Box, Typography } from '@mui/material';

const About: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: '20px',
          textAlign: 'center',
          color: 'gray',
        }}
      >
        This page is a work in progress. Stay tuned for updates!
      </Typography>
      <img
        src='/image0.jpg'
        alt="Your image description"
        style={{
          maxWidth: '80%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default About;
