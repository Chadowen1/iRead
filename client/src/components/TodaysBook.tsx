import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useNavigate } from 'react-router-dom';

function TodaysBook(props) {
    const { content } = props;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/book/${content.id}`);
    };

    return (
        <Grid item md={6}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <CardActionArea onClick={handleClick} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 130, ml: 2 }}
                        image={content.image}
                        alt={content.title}
                    />
                </CardActionArea>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h6">
                            {content.title}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" component="div">
                            {content.author}
                        </Typography>
                        <Typography variant="subtitle2">
                            <span dangerouslySetInnerHTML={{ __html: content.desc }} />
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        <IconButton aria-label="favorite">
                            <FavoriteBorderIcon sx={{ height: 25, width: 25 }} />
                        </IconButton>
                        <IconButton aria-label="thumb-down">
                            <ThumbDownOffAltIcon sx={{ height: 25, width: 25 }} />
                        </IconButton>
                        <IconButton aria-label="add">
                            <AddIcon sx={{ height: 25, width: 25 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
        </Grid>
    );
}

TodaysBook.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
};

export default TodaysBook;
