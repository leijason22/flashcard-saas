"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase"; // Ensure correct path to firebase.js

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null; // Ensure useSearchParams is only used on the client
  const search = searchParams?.get("id");

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;

      try {
        // Fetch flashcards data from Firestore
        const docRef = doc(db, `users/${user.id}/flashcardSets/${search}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const flashcardsData = docSnap.data().flashcards || [];
          setFlashcards(flashcardsData);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcards();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      {isLoaded && isSignedIn ? (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box>
                      <Typography variant="h5" component="div">
                        {flipped[index] ? flashcard.back : flashcard.front}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
          Please sign in to view your flashcards.
        </Typography>
      )}
    </Container>
  );
}
