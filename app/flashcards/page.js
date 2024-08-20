'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';
import { getDoc, doc, setDoc, collection } from 'firebase/firestore';
import { Container, Grid, CardContent, Card, CardActionArea, Typography } from '@mui/material';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                backgroundColor: '#000', // Black background for the card
                                color: '#fff', // White text color
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                    backgroundColor: '#008080', // Dark teal on hover
                                },
                            }}
                        >
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent
                                    sx={{
                                        height: '150px', // Set a fixed height for consistent card size
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="h5" component="div" align="center">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
