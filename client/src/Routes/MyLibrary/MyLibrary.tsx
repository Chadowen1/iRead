import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import getLPTheme from '../LandingPage/getLPTheme';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import BookCard from '../../components/BookCard';

const sidebar = {
    title: 'News & Interviews',
    description: `2024's Campus Novels and Dark Academia for Back-to-School Season`,
    books: [
        { title: 'Best Books 2023', url: '#' },
        { title: 'Best Fiction', url: '#' },
        { title: 'Best Romantasy', url: '#' },
        { title: 'Best Romance', url: '#' },
        { title: 'Best Nonfiction', url: '#' },
        { title: 'Best History & Biography', url: '#' },
        { title: 'Best Memoir & Autobiography', url: '#' },
        { title: 'Best Humor', url: '#' },
        { title: 'Best Debut Novel', url: '#' },
        { title: 'Best Young Adult Fiction', url: '#' },
        { title: 'Best Historical Fiction', url: '#' },
    ],
    quotes: [
        { title: 'Best quotes', url: '#' },
        { title: 'Funny quotes', url: '#' },
        { title: 'Motivational quotes', url: '#' },
        { title: 'Positive quotes', url: '#' },
        { title: 'Friends quotes', url: '#' },
        { title: 'Life quotes', url: '#' },
        { title: 'Love quotes', url: '#' },
        { title: 'More quotes', url: '#' },
    ],
};

export default function MyLibrary() {
    const [mode] = React.useState('light');
    const [books, setBooks] = useState([]);
    const LPtheme = createTheme(getLPTheme(mode));
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    'http://localhost:3000/user/myLibrary',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, []);

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
                    <Grid container spacing={1} sx={{ mt: 3 }}>
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                {books.map(book => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                                        <BookCard content={book} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Sidebar
                            title={sidebar.title}
                            description={sidebar.description}
                            books={sidebar.books}
                            quotes={sidebar.quotes}
                        />
                    </Grid>
                    <Footer />
                </Container>
            </Box>
        </ThemeProvider>
    );
}