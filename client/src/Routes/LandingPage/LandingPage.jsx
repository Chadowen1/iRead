import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from "../../components/Header";
import Typography from '@mui/material/Typography';
import Hero from '../../components/Hero';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TodaysQuote from '../../components/TodaysQuote';
import TodaysBook from '../../components/TodaysBook';
import BookCard from '../../components/BookCard';
import getLPTheme from './getLPTheme';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Skeleton from '@mui/material/Skeleton';

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

const bookCategories = [
    { title: 'Fiction', content: [] },
    { title: 'NonFiction', content: [] },
    { title: 'Romance', content: [] },
];

export default function LandingPage() {
    const [mode] = React.useState('light');
    const LPtheme = createTheme(getLPTheme(mode));
    const [quote, setQuote] = React.useState(null);
    const [book, setBook] = React.useState(null);
    const [categories, setCategories] = React.useState(bookCategories);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        const fetchQuote = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const storedQuote = JSON.parse(localStorage.getItem('todaysQuote'));
                if (storedQuote && storedQuote.date === today) {
                    setQuote(storedQuote.data);
                } else {
                    const response = await axios.get('http://localhost:3000/quotes/todaysQuote');
                    const quoteData = response.data;
                    localStorage.setItem('todaysQuote', JSON.stringify({ date: today, data: quoteData }));
                    setQuote(quoteData);
                }
            } catch (error) {
                console.error('Error fetching quote:', error);
            }
        };

        const fetchBook = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const storedBook = JSON.parse(localStorage.getItem('todaysBook'));
                if (storedBook && storedBook.date === today) {
                    setBook(storedBook.data);
                } else {
                    const response = await axios.get('http://localhost:3000/books/todaysBook');
                    const bookData = response.data;
                    localStorage.setItem('todaysBook', JSON.stringify({ date: today, data: bookData }));
                    setBook(bookData);
                }
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };

        const fetchBooksByGenre = async () => {
            try {
                const updatedCategories = await Promise.all(
                    bookCategories.map(async (category) => {
                        try {
                            const response = await axios.get('http://localhost:3000/books/byGenre', {
                                params: { genre: category.title, limit: 4 }
                            });
                            // Ensure content is always an array from the response's data property
                            return { ...category, content: Array.isArray(response.data.data) ? response.data.data : [] };
                        } catch (error) {
                            console.error(`Error fetching books for genre ${category.title}:`, error);
                            // Return empty array in case of error
                            return { ...category, content: [] };
                        }
                    })
                );
                setCategories(updatedCategories);
                setIsLoading(false); // Set loading to false when data is loaded
            } catch (error) {
                console.error('Error fetching books by genre:', error);
                setIsLoading(false); // Set loading to false even if there is an error
            }
        };

        fetchQuote();
        fetchBook();
        fetchBooksByGenre();
    }, []);

    return (
        <ThemeProvider theme={LPtheme}>
            <CssBaseline />
            <Header />
            <Hero />
            <Container maxWidth="lg">
                <Typography component="h2" variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
                    Today's Picks
                </Typography>
                <Box sx={{ bgcolor: 'background.default', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid container spacing={4} justifyContent="center">
                        {quote ? <TodaysQuote key={quote.title} content={quote} /> : <Skeleton variant="rectangular" width={210} height={118} />}
                        {book ? <TodaysBook key={book.title} content={book} /> : <Skeleton variant="rectangular" width={210} height={118} />}
                    </Grid>
                </Box>
                <Divider sx={{ mt: 4 }} />
                <Grid container spacing={1} sx={{ mt: 3 }}>
                    <Grid item xs={8}>
                        {categories.map((category) => (
                            <React.Fragment key={category.title}>
                                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                                    {category.title}
                                </Typography>
                                <Grid container spacing={2}>
                                    {isLoading
                                        ? Array.from({ length: 4 }).map((_, index) => (
                                            <Grid item key={index} md={3}>
                                                <Skeleton variant="rectangular" width={160} height={240} />
                                            </Grid>
                                        ))
                                        : category.content.map((book) => (
                                            <Grid item key={book.title} md={3}>
                                                <BookCard content={book} />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                    <Sidebar
                        title={sidebar.title}
                        description={sidebar.description}
                        books={sidebar.books}
                        quotes={sidebar.quotes}
                    />
                </Grid>
                <Divider sx={{ mt: 4 }} />
                <Footer />
            </Container>
        </ThemeProvider>
    );
}
