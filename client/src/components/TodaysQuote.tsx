import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function TodaysQuote(props) {
    const { content } = props;

    return (
        <Grid item md={6}>
            <CardActionArea component="a" href="#">
                <Card sx={{ display: 'flex', height: '100%' }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            flex: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                maxHeight: '105px', // Adjust this value as needed
                                paddingRight: '16px', // Space for scrollbar
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'break-word',
                                }}
                            >
                                ❝ {content.quote} ❞
                            </Typography>
                        </div>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{
                                marginTop: '16px',
                                flexShrink: 0,
                                paddingTop: '8px',
                                borderTop: '1px solid #ddd',
                            }}
                        >
                            {content.author}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: 130, display: 'block' }}
                        image={content.image}
                    />
                </Card>
            </CardActionArea>
        </Grid>
    );
}

TodaysQuote.propTypes = {
    content: PropTypes.shape({
        author: PropTypes.string.isRequired,
        quote: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
};

export default TodaysQuote;
