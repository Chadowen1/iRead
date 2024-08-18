import express from 'express';
import { Quote } from '../models/models.js';
import axios from 'axios';

const router = express.Router();

// Google Custom Search API details
const GOOGLE_API_KEY = 'AIzaSyBr9s0-d3icQey8soSNX_ugE2LolpeQt-s';
const CX = '65d1d1b276f964ecf';

// Helper function to fetch an image based on the author name
async function fetchAuthorImage(author) {
    try {
        const authorName = author.split(',')[0].trim();

        const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
                q: authorName,
                cx: CX,
                searchType: 'image',
                key: GOOGLE_API_KEY,
                num: 1
            }
        });

        return response.data.items[0]?.link || './Unknown_person.jpg';
    } catch (error) {
        console.error('Error fetching author image:', error);
        return './Unknown_person.jpg';
    }
}

// GET /todaysQuote - Fetch a random quote
router.get('/todaysQuote', async (req, res) => {
    try {
        // Get a random quote from the database
        const count = await Quote.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quote.findOne().skip(randomIndex);

        // Fetch the author's image
        const imageUrl = await fetchAuthorImage(randomQuote.author);

        // Format the result
        const todaysQuote = {
            author: randomQuote.author,
            quote: randomQuote.quote,
            image: imageUrl,
        };

        res.json(todaysQuote);
    } catch (err) {
        console.error('Error fetching quote:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
