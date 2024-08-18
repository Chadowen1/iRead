import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
// import CardActions from '@mui/material/CardActions';
import Rating from '@mui/material/Rating';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
// import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

const fallbackImage = 'https://via.placeholder.com/200x300?text=No+Image';

function BookCard({ content = {} }) {
    const navigate = useNavigate();
    const {
        _id,
        image = 'https://via.placeholder.com/200x300?text=No+Image',
        title = 'Unknown Title',
        author = 'Unknown Author',
        ratingScore = '0',
    } = content;

    const handleCardClick = () => {
        navigate(`/book/${_id}`);
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
                onClick={handleCardClick}
                raised
                sx={{
                    position: 'relative',
                    width: 160,
                    height: 240,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover .overlay': {
                        opacity: 1,
                    },
                    '&:hover .media': {
                        filter: 'blur(4px)',
                    }
                }}
            >
                <CardMedia
                    component="img"
                    height="240"
                    image={image || fallbackImage}
                    alt={title}
                    className="media"
                    sx={{
                        transition: '0.3s ease',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                <Box
                    className="overlay"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 1,
                    }}
                >
                    <CardContent>
                        <Tooltip title={title} arrow>
                            <Typography variant="body2" component="div" noWrap>
                                {title}
                            </Typography>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {author}
                        </Typography>
                        <Rating
                            name="read-only"
                            value={parseFloat(ratingScore)}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </CardContent>
                    {/* <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <FavoriteBorderIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton aria-label="dislike">
                            <ThumbDownOffAltIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton aria-label="add to library">
                            <AddIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </CardActions> */}
                </Box>
            </Card>
        </Grid>
    );
}

BookCard.propTypes = {
    content: PropTypes.shape({
        author: PropTypes.string,
        image: PropTypes.string,
        title: PropTypes.string,
        rating: PropTypes.number,
    }),
};

export default BookCard;
