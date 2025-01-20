"use client";

import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Typography, Box, Button } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "../firebase"; // Ensure correct path to firebase.js
import { useUser } from "@clerk/nextjs";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const { isLoaded, isSignedIn, user } = useUser();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
        const sessionData = await res.json();

        if (res.ok) {
          setSession(sessionData);

          if (sessionData.payment_status === "paid" && isLoaded && isSignedIn) {
            await handleSuccessfulPayment(sessionData);
          }
        } else {
          setError(sessionData.error || "Failed to retrieve session details.");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("An error occurred while retrieving the session.");
      } finally {
        setLoading(false);
      }
    };

    const handleSuccessfulPayment = async (sessionData) => {
      try {
        if (!user || !user.id) {
          throw new Error("User is not authenticated.");
        }

        // Save purchase details to Firestore
        const userDocRef = doc(db, `users/${user.id}`);
        await updateDoc(userDocRef, {
          purchases: arrayUnion({
            sessionId: session_id,
            flashcardSet: "Purchased Flashcard Set", // Update as needed
            timestamp: new Date(),
          }),
        });

        console.log("Purchase details saved to Firestore.");
      } catch (error) {
        console.error("Error saving purchase details:", error);
        setError("An error occurred while saving your purchase. Please contact support.");
      }
    };

    fetchCheckoutSession();
  }, [session_id, isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      {session.payment_status === "paid" ? (
        <>
          <Typography variant="h4">Thank you for your purchase!</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with the order details shortly.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => router.push(`/flashcards?id=${session_id}`)}
            >
              View Flashcards
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment failed</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Your payment was not successful. Please try again.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => router.push("/generate")}
            >
              Go Back to Generate
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
