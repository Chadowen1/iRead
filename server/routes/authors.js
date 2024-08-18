import express from 'express';
import axios from 'axios';

const router = express.Router();

// Helper function to sanitize the author name by replacing special characters with spaces
function sanitizeAuthorName(authorName) {
    return authorName.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
}

// Helper function to search for an author and get their key
async function searchAuthor(authorName) {
    try {
        const sanitizedAuthorName = sanitizeAuthorName(authorName);
        const response = await axios.get('https://openlibrary.org/search/authors.json', {
            params: { q: sanitizedAuthorName }
        });

        // Check if author data is available
        const authors = response.data.docs;
        if (authors.length > 0) {
            // Find the best match for the author
            const bestMatch = authors.find(author => author.name.toLowerCase() === authorName.toLowerCase());
            const authorKey = bestMatch ? bestMatch.key : authors[0].key; // Use the exact match if found, otherwise the first entry

            return authorKey;
        }
        return null;
    } catch (error) {
        console.error('Error searching for author:', error);
        return null;
    }
}

// Helper function to fetch the number of works for an author
async function fetchNumberOfWorks(authorKey) {
    try {
        const worksUrl = `https://openlibrary.org/authors/${authorKey}/works.json?limit=1000`;
        const response = await axios.get(worksUrl);
        return response.data.size || 0;
    } catch (error) {
        console.error('Error fetching number of works:', error);
        return 0;
    }
}

// Helper function to fetch detailed information about an author
async function fetchAuthorInfo(authorKey) {
    try {
        const authorUrl = `https://openlibrary.org/authors/${authorKey}.json`;
        const response = await axios.get(authorUrl);
        const author = response.data;

        // Fetch the number of works
        const workCount = await fetchNumberOfWorks(authorKey);

        return {
            name: author.name || 'Unknown',
            birthDate: author.birth_date || 'Unknown',
            topWork: author.top_work || 'No top work available',
            workCount: workCount,
            bio: author.bio || 'No biography available',
            photoUrl: author.photos && author.photos.length > 0 ? `https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg` : 'default-photo-url',
            officialSite: author.links ? (author.links.find(link => link.title === 'Official Site')?.url || 'No official site available') : 'No official site available',
            wikipedia: author.wikipedia || 'No Wikipedia page available'
        };
    } catch (error) {
        console.error('Error fetching author info:', error);
        return {
            name: 'Unknown',
            birthDate: 'Unknown',
            topWork: 'No top work available',
            workCount: 0,
            bio: 'No biography available',
            photoUrl: 'default-photo-url',
            officialSite: 'No official site available',
            wikipedia: 'No Wikipedia page available'
        };
    }
}

// GET /authors/authorInfo - Fetch information about an author
router.get('/authorInfo', async (req, res) => {
    try {
        const authorName = req.query.name;
        if (!authorName) {
            return res.status(400).json({ message: 'Author name is required' });
        }
        const authorKey = await searchAuthor(authorName);
        if (!authorKey) {
            return res.status(404).json({ message: 'Author not found' });
        }
        const authorInfo = await fetchAuthorInfo(authorKey);
        res.json(authorInfo);
    } catch (err) {
        console.error('Error fetching author info:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
