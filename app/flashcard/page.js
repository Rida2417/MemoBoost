'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { db } from '@/firebase'; // Ensure this path is correct

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcards() {
            if (!search || !user) return;

            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        getFlashcards();
    }, [search, user]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    return (
        <Container maxWidth="100hw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} md={4} key={flashcard.id}>
                        <Card sx={{
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            backgroundColor: '#000', // Black background for the card
                            color: '#fff', // White text color
                            boxShadow: 3,
                            perspective: '1000px', // Enable 3D perspective
                            '&:hover': {
                                boxShadow: 6,
                            },
                        }}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)} sx={{
                                width: '100%',
                                height: '100%',
                            }}>
                                <CardContent sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    transition: 'transform 0.6s',
                                    transformStyle: 'preserve-3d',
                                    transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0, // Remove padding to keep content full-sized
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        boxSizing: 'border-box',
                                        padding: 16, // Padding for text inside the card
                                    }}>
                                        <Typography variant="h6" component="div" align="center">
                                            {flashcard.front} {/* Question displayed here */}
                                        </Typography>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#008080',
                                        color: '#fff',
                                        boxSizing: 'border-box',
                                        padding: 16, // Padding for text inside the card
                                        transform: 'rotateY(180deg)',
                                    }}>
                                        <Typography variant="h6" component="div" align="center">
                                            {flashcard.back} {/* Answer displayed here */}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
