import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import getLPTheme from '../LandingPage/getLPTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

function Copyright(props: { sx?: any }) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                iRead
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignUp() {
    const [mode] = React.useState<'light' | 'dark'>('light');
    const LPtheme = createTheme(getLPTheme(mode) as ThemeOptions);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(event.target.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const payload = {
            firstName: data.get('firstName') as string,
            lastName: data.get('lastName') as string,
            email: data.get('email') as string,
            password: data.get('password') as string,
            birthdate: data.get('birthdate') as string,
        };

        // Check if terms are accepted
        if (!termsAccepted) {
            setMessage('You must agree to the Terms of Service and Privacy Policy');
            setSeverity('error');
            setOpen(true);
            return;
        }

        try {
            await axios.post('http://localhost:3000/auth/signup', payload);
            setMessage('User created successfully!');
            setSeverity('success');
            setOpen(true);

            // Introduce a delay before redirecting
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2 seconds delay for the success message to be shown
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error during registration. Please try again.';
            setMessage(errorMessage);
            setSeverity('error');
            setOpen(true);
            console.error('Error during registration:', error);
        }
    };

    return (
        <ThemeProvider theme={LPtheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    margin="dense"
                                    name="firstName"
                                    size="medium"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="Enter your First Name"
                                    placeholder="First Name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    margin="dense"
                                    name="lastName"
                                    size="medium"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="Enter your Last Name"
                                    placeholder="Last Name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    margin="dense"
                                    name="email"
                                    size="medium"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="Enter your email address"
                                    placeholder="Email Address"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    margin="dense"
                                    type="password"
                                    name="password"
                                    size="medium"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="Enter your password"
                                    placeholder="Password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    margin="dense"
                                    type="date"
                                    name="birthdate"
                                    size="medium"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="Enter your birthdate"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox checked={termsAccepted} onChange={handleTermsChange} color="primary" />}
                                    label="I agree to the iRead Terms of Service and Privacy Policy"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5, mb: 5 }} />
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}
