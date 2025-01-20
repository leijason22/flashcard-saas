"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const handleSubmit = async () => {
  const checkoutSession = await fetch("/api/checkout_sessions", {
    method: "POST",
    headers: { origin: "http://localhost:3000" },
  });
  const checkoutSessionJson = await checkoutSession.json();

  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  });

  if (error) {
    console.warn(error.message);
  }
};

export default function Home() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI-Powered Flashcard Generation
                </Typography>
                <Typography>
                  Automatically generate flashcards from your text using cutting-edge AI.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customizable Flashcards
                </Typography>
                <Typography>
                  Personalize your flashcards with themes, colors, and layouts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cloud Sync
                </Typography>
                <Typography>
                  Save and access your flashcards anywhere, anytime on any device.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Free Plan
                </Typography>
                <Typography>$0/month</Typography>
                <Typography>Basic flashcard creation</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary">
                  Sign Up
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pro Plan
                </Typography>
                <Typography>$9.99/month</Typography>
                <Typography>
                  Unlimited flashcards, themes, and cloud sync.
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary">
                  Choose Pro
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Plan
                </Typography>
                <Typography>$29.99/month</Typography>
                <Typography>
                  Collaborative features for teams and organizations.
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary">
                  Choose Team
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
