'use client';

import { AppBar, Box, Button, Container, Grid, Toolbar, Typography,Link } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import getStripe from "@/utils/getStripe";

// Define the purple and black theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Deep purple
    },
    secondary: {
      main: '#212121', // Dark gray (almost black)
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1E1E1E', // Darker cards
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#B0B0B0', // Light gray text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.status === 500) {
      console.log(checkoutSession.message);
      return;
    }
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100hw" sx={{ padding: 4, backgroundColor: theme.palette.background.default }}>
        {/* AppBar */}
        <AppBar position="sticky" color="secondary">
          <Toolbar>
            <Typography variant="h3" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
              MemoBoost
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Log In</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography variant="h2" gutterBottom color="primary">
            Welcome to MemoBoost
          </Typography>
          <Typography variant="h5" gutterBottom color="textSecondary">
            The easiest way to make flashcards from text
          </Typography>
          <Button color="primary" variant="contained" sx={{ mt:2 }}>
            <Link href="/sign-up" passHref style={{ textDecoration: 'none', color: '#fff' }}>
              Get Started
            </Link>
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">Features</Typography>
          <Grid container spacing={4} justifyContent="center">
            {[{ title: 'Easy Text Input', description: 'Simply input the text and leave the rest to us.' },
            { title: 'Smart Flashcards', description: 'Our AI helps in making your flashcards perfectly.' },
            { title: 'Accessible Anywhere', description: 'Access your flashcards from any device.' }]
              .map((feature) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <Box sx={{
                    p: 3, m: 2,
                    border: '1px solid #333', borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 6, backgroundColor: '#333' }
                  }}>
                    <Typography variant="h6" gutterBottom color="primary">{feature.title}</Typography>
                    <Typography variant="body1" color="textSecondary">{feature.description}</Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">Pricing</Typography>
          <Grid container spacing={4} justifyContent="center">
            {[{ title: 'Standard', price: '$5 / Month', description: 'Get the Standard flashcard features with more storage' },
            { title: 'Professional', price: '$10 / Month', description: 'Get perfect flashcard features with unlimited storage' }]
              .map((plan) => (
                <Grid item xs={12} md={4} key={plan.title}>
                  <Box sx={{
                    p: 3, m: 2,
                    border: '1px solid #333', borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 6, backgroundColor: '#333' }
                  }}>
                    <Typography variant="h4" gutterBottom color="primary">{plan.title}</Typography>
                    <Typography variant="h6" gutterBottom color="textSecondary">{plan.price}</Typography>
                    <Typography variant="body1" color="textSecondary">{plan.description}</Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Now</Button>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
