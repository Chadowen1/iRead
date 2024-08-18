import express from 'express';
import { Quote } from '../models/models.js';
import axios from 'axios';

const router = express.Router();

// Helper function to fetch an image based on the author name
async function fetchAuthorImage(author) {
    try {
        const authorName = author.split(',')[0].trim();
        const response = await axios.get(`https://openlibrary.org/search/authors.json`, {
            params: { q: authorName }
        });

        // Check if an author was found
        if (response.data.docs && response.data.docs.length > 0) {
            const authorData = response.data.docs[0];
            const authorKey = authorData.key;

            // Fetch the author details, including the image
            const authorDetails = await axios.get(`https://openlibrary.org${authorKey}.json`);

            // Open Library often stores the image in the "photos" array; use the first available image
            const imageId = authorDetails.data.photos?.[0];
            if (imageId) {
                return `https://covers.openlibrary.org/b/id/${imageId}-L.jpg`; // 'L' is for a large image size
            }
        }

        // Return a default image if no image is found
        return './Unknown_person.jpg';
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
