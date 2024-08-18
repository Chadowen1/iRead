import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Sidebar(props) {
    const { books, description, quotes, title } = props;

    return (
        <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100' }} >
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography sx={{mb: 1}}>{description}</Typography>
                <img
                    width="100%"
                    height={160}
                    src='./article.png'
                    loading="lazy"
                    style={{
                        objectFit: 'cover',
                        borderRadius: '4px',
                    }}
                />
            </Paper>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Books
            </Typography>
            {books.map((books) => (
                <Link display="block" variant="body1" href={books.url} key={books.title}>
                    {books.title}
                </Link>
            ))}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Quotes
            </Typography>
            {quotes.map((quote) => (
                <Link display="block" variant="body1" href={quote.url} key={quote.title}>
                    {quote.title}
                </Link>
            ))}
        </Grid>
    );
}

Sidebar.propTypes = {
    books: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }),
    ).isRequired,
    description: PropTypes.string.isRequired,
    quotes: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }),
    ).isRequired,
    title: PropTypes.string.isRequired,
};

export default Sidebar;