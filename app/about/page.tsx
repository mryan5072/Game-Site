import { Box } from '@mui/material';

const About: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '80vh',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
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
