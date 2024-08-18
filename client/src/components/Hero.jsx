import * as React from 'react';
import { alpha, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Hero() {
    return (
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
                <Box
                    id="image"
                    sx={() => ({
                        mt: 1,
                        mb: 0,
                        alignSelf: 'center',
                        height: 350,
                        width: '100%',
                        backgroundImage: 'url("./books-festival-banner.jpg")',
                        backgroundSize: 'cover',
                        borderRadius: '10px',
                        position: 'relative',
                        outline: '1px solid',
                        outlineColor: alpha('#BFCCD9', 0.5),
                        boxShadow: `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`,
                    })}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        sx={{
                            width: '120px',
                            position: 'absolute',
                            bottom: '3.5rem',
                            right: '10rem',
                            zIndex: 1,
                        }}
                    >
                        Join Us
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
