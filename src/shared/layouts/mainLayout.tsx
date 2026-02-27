import { Box, Container } from '@mui/material';
import { Header } from './header';
import { Footer } from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};
