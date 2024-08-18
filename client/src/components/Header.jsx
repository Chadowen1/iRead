import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const sections = [
    { title: 'Fiction', url: '#' },
    { title: 'Crime', url: '#' },
    { title: 'Romance', url: '#' },
    { title: 'Children\'s', url: '#' },
    { title: 'Adventure', url: '#' },
    { title: 'Mystery', url: '#' },
    { title: 'Comedy', url: '#' },
    { title: 'Erotica', url: '#' },
    { title: 'Historical', url: '#' },
    { title: 'Dystopia', url: '#' },
];

function Header() {
    const [myOptions, setMyOptions] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by looking for a token in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    // Function to fetch search suggestions from backend
    const getDataFromAPI = async (event) => {
        const query = event.target.value;
        if (query.length < 2) {
            setMyOptions([]);
            return;
        }
        try {
            const response = await axios.get('http://localhost:3000/books/search', {
                params: { q: query }
            });
            const options = response.data.data.map(book => ({
                title: book.title,
                id: book.id
            }));
            setMyOptions(options);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setMyOptions([]);
        }
    };


    const handleSignOut = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleOptionSelect = (event, value) => {
        if (value && value.id) {
            navigate(`/book/${value.id}`);
        }
    };

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        variant="regular"
                        sx={() => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                            borderRadius: '999px',
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: 40,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
                        })}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                ml: '-18px',
                                px: 2.5,
                            }}
                        >
                            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontSize: '26px',
                                        color: '#13110a',
                                    }}
                                >
                                    i
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="h2"
                                    sx={{
                                        fontSize: '26px',
                                        color: 'primary.main',
                                    }}
                                >
                                    Read
                                </Typography>
                            </RouterLink>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    ml: '-18px',
                                    px: 0,
                                }}
                            >
                                <Autocomplete
                                    style={{ width: 380 }}
                                    freeSolo
                                    autoComplete
                                    autoHighlight
                                    options={myOptions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionSelect}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            onChange={getDataFromAPI}
                                            variant="outlined"
                                            placeholder="Search a book"
                                        />
                                    )}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 0.5,
                                alignItems: 'center',
                            }}
                        >
                            {isLoggedIn ? (
                                <>
                                    <Button
                                        sx={{mr: 2}}
                                        color="primary"
                                        variant="text"
                                        size="small"
                                        component={RouterLink}
                                        to="/mylibrary"
                                    >
                                        My Library
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        sx={{mr: 2}}
                                        color="primary"
                                        variant="text"
                                        size="small"
                                        component={RouterLink}
                                        to="/login"
                                    >
                                        Sign in
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        component={RouterLink}
                                        to="/register"
                                    >
                                        Sign up
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                    <Toolbar
                        component="nav"
                        variant="dense"
                        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
                    >
                        {sections.map((section) => (
                            <Link
                                color="#13110a"
                                noWrap
                                key={section.title}
                                variant="body2"
                                href={section.url}
                                sx={{ p: 1, flexShrink: 0 }}
                            >
                                {section.title}
                            </Link>
                        ))}
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

export default Header;