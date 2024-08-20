'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Container, TextField, Button, Typography, Box, Grid, Card, CardActionArea, CardContent, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import { collection, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Generate() {
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { user } = useUser();
    const [flipped, setFlipped] = useState({});
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data));
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const saveFlashcards = async () => {
        if (!name) {
            alert("Enter a name");
            return;
        }
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collection = docSnap.data().flashcards || [];
            if (collection.find((f) => f.name === name)) {
                alert('Flashcard set already exists');
                return;
            } else {
                collection.push({ name });
                batch.set(userDocRef, { flashcards: collection }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }
        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth="100hw">
            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Generate Flashcards
                </Typography>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mb: 4 }}
                >
                    Generate Flashcards
                </Button>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        FlashCard Preview
                    </Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    boxShadow: 3,
                                    perspective: '1000px',
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}>
                                    <CardActionArea onClick={() => handleCardClick(index)} sx={{
                                        width: '100%',
                                        height: '100%',
                                    }}>
                                        <CardContent sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
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
                                                padding: 16,
                                            }}>
                                                <Typography variant="h6" component="div" align="center">
                                                    {flashcard.front}
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
                                                padding: 16,
                                                transform: 'rotateY(180deg)',
                                            }}>
                                                <Typography variant="h6" component="div" align="center">
                                                    {flashcard.back}
                                                </Typography>
                                            </div>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', marginBottom:5}}>
                        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                            Save Flashcard Set
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Save Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={saveFlashcards} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
