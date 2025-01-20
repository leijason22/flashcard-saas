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
import { useSearchParams, useRouter } from "next/navigation";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;

      try {
        // Firestore fetching logic
        const flashcardsData = []; // Populate this from Firestore response
        setFlashcards(flashcardsData);
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
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box sx={{ /* Add styles for flipping */ }}>
                    <div>
                      <Typography variant="h5" component="div">
                        {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
