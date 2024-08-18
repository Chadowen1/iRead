import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import getLPTheme from '../LandingPage/getLPTheme';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

const fallbackImage = 'https://via.placeholder.com/200x300?text=No+Image';

export default function Book() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [mode] = React.useState('light');
    const [authorInfo, setAuthorInfo] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [inLibrary, setInLibrary] = useState(false);
    const LPtheme = createTheme(getLPTheme(mode));
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by looking for a token in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/books/book/${id}`);
                if (response.data) {
                    setBook(response.data);
                    // Fetch author info based on the first author (assuming a single author for simplicity)
                    if (response.data.authors[0]) {
                        const authorResponse = await axios.get(`http://localhost:3000/authors/authorInfo?name=${response.data.authors[0]}`);
                        setAuthorInfo(authorResponse.data);
                    }
                } else {
                    console.error('Book not found');
                }
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        const checkIfInLibrary = async () => {
            if (isLoggedIn) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3000/user/isInLibrary/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setInLibrary(response.data.isInLibrary);
                } catch (error) {
                    console.error('Error checking library status:', error);
                }
            }
        };

        if (id) {
            fetchBook();
            checkIfInLibrary();
        }
    }, [id, isLoggedIn]);

    const handleWantToRead = async () => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page if not logged in
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3000/user/wantToRead',
                { bookId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data.message === 'Book added to myLibrary') {
                setInLibrary(true);
            } else if (response.data.message === 'Book removed from myLibrary') {
                setInLibrary(false);
            }
        } catch (error) {
            console.error('Error updating myLibrary:', error);
        }
    };

    return (
        <ThemeProvider theme={LPtheme}>
            <CssBaseline />
            <Header />
            <Box
                id="hero"
                sx={{
                    width: '100%',
                    backgroundImage: 'linear-gradient(180deg, #dbcda1, #fdfaf1)',
                    backgroundSize: '100% 20%',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: 17,
                        pb: 8,
                    }}
                >
                    <Box sx={{ flexGrow: 1 }} >
                        <Grid container spacing={2} >
                            <Grid item xs={4} >
                                {/* Left side: book cover and actions */}
                                {book && (
                                    <Stack spacing={1} alignItems="center" >
                                        <img
                                            src={book?.image || fallbackImage}
                                            alt={book.title}
                                            style={{
                                                width: '200px',
                                                borderTopRightRadius: '20px',
                                                borderBottomRightRadius: '20px',
                                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                                transform: 'translateY(-4px)',
                                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            sx={{ width: '60%', mt: 2, mb: 1 }}
                                            onClick={handleWantToRead}
                                        >
                                            {inLibrary ? 'Remove from Library' : 'Want to Read'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{ width: '60%' }}
                                        >
                                            Buy This Book
                                        </Button>
                                        <Rating
                                            precision={0.5}
                                            name="simple-controlled"
                                            value={value}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                        />
                                        <Typography variant="body1">
                                            Rate this book
                                        </Typography>
                                    </Stack>
                                )}
                            </Grid>
                            <Grid item xs={8}>
                                {/* Right side: book details */}
                                <Box sx={{ width: '100%' }}>
                                    <Stack spacing={0}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontStyle: 'italic',
                                                color: 'gray',
                                            }}
                                        >
                                            {book?.seriesTitle}
                                        </Typography>
                                        <Typography variant="h4">{book?.title}</Typography>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {book?.authors.join(', ')}
                                        </Typography>
                                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                            <Rating
                                                readOnly
                                                precision={0.1}
                                                name="book-rating"
                                                value={parseFloat(book?.ratingScore)}
                                            />
                                            <Typography variant="h5">
                                                {book?.ratingScore}
                                            </Typography>
                                            <Typography variant="body1">
                                                {book?.numRatings} ratings • {book?.numReviews} reviews
                                            </Typography>
                                        </Stack>
                                        <Typography variant="subtitle2">
                                            {expanded
                                                ? book?.description
                                                : `${book?.description.substring(0, 200)}... `}
                                            {book?.description.length > 200 && (
                                                <Button variant="text" onClick={() => setExpanded(!expanded)}>
                                                    {expanded ? 'Show Less' : 'Read More'}
                                                </Button>
                                            )}
                                        </Typography>
                                        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
                                            <Typography variant="body1">
                                                Genres:
                                            </Typography>
                                            {book?.genres?.map((genre) => (
                                                <Link
                                                    color="#13110a"
                                                    key={genre}
                                                    variant="body2"
                                                    href={`#${genre.toLowerCase().replace(/\s+/g, '-')}`}
                                                >
                                                    {genre}
                                                </Link>
                                            ))}
                                        </Stack>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {book?.numPages} pages, {book?.format}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            First published {new Date(book?.publicationDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Publisher: {book?.publisher}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Language: {book?.language}
                                        </Typography>
                                        <Divider sx={{ mt: 2 }} />
                                        <Stack direction="row" spacing={4} sx={{ mt: 5, mb: 5, alignItems: 'center', justifyContent: 'center' }}>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                <AvatarGroup max={3}>
                                                    <Avatar alt="Remy Sharp" src="/avatar1.jpg" sx={{ width: 30, height: 30 }} />
                                                    <Avatar alt="Travis Howard" src="/avatar2.jpg" sx={{ width: 30, height: 30 }} />
                                                    <Avatar alt="Agnes Walker" src="/avatar3.jpg" sx={{ width: 30, height: 30 }} />
                                                </AvatarGroup>
                                                <Typography variant="body1">{book?.currentReaders} people are currently reading</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                <AvatarGroup max={3}>
                                                    <Avatar alt="Elina Sharp" src="/avatar4.jpg" sx={{ width: 30, height: 30 }} />
                                                    <Avatar alt="James Howard" src="/avatar5.jpg" sx={{ width: 30, height: 30 }} />
                                                    <Avatar alt="Amy Walker" src="/avatar6.jpg" sx={{ width: 30, height: 30 }} />
                                                </AvatarGroup>
                                                <Typography variant="body1">{book?.wantToRead} people want to read</Typography>
                                            </Stack>
                                        </Stack>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            About the author
                                        </Typography>
                                        {/* Author Information Section */}
                                        {authorInfo ? (
                                            <Stack spacing={2} sx={{ mb: 2 }}>
                                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                    <Avatar alt="Elina Sharp" src={authorInfo.photoUrl || fallbackImage} sx={{ width: 80, height: 80 }} />
                                                    <Stack spacing={0}>
                                                        <Typography variant="h6">{authorInfo.name}</Typography>
                                                        <Typography variant="body2" color="gray">{authorInfo.workCount} books</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Typography variant="body1">{authorInfo.bio}</Typography>
                                                <Link href={authorInfo.officialSite} variant="body2" color="primary">
                                                    Author's Website
                                                </Link>
                                                <Link href={authorInfo.wikipedia} variant="body2" color="primary">
                                                    Author's Wikipedia
                                                </Link>
                                            </Stack>
                                        ) : (
                                            <Typography variant="body1">Loading author information...</Typography>
                                        )}
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Footer />
                </Container>
            </Box >
        </ThemeProvider >
    );
}