import express from 'express';
import { Book } from '../models/models.js';
import axios from 'axios';

const router = express.Router();

// Helper function to fetch the book cover based on the title
async function fetchBookCover(title) {
    try {
        // Make the API request to Open Library to search for the book cover
        const response = await axios.get('https://openlibrary.org/search.json', {
            params: { title: title }
        });

        // Extract the first book's cover image if available
        const coverId = response.data.docs[0]?.cover_i;
        const coverImage = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';

        return coverImage;
    } catch (error) {
        console.error('Error fetching book cover:', error);
        return '';
    }
}

// Helper function to sanitize the description
function sanitizeDescription(description) {
    return description
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .replace(/\s\s+/g, ' ') // Replace multiple spaces with a single space
        .trim(); // Remove leading and trailing spaces
}

// Helper function to truncate the description
function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) return description;

    // Truncate and add ellipsis
    let truncated = description.substring(0, maxLength).trim();

    // Ensure it ends cleanly
    truncated = truncated.substring(0, truncated.lastIndexOf(' '));

    return `${truncated}...`;
}

// GET /todaysBook - Fetch a random book
router.get('/todaysBook', async (req, res) => {
    try {
        // Get a random book from the database
        const count = await Book.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomBook = await Book.findOne().skip(randomIndex);

        // Fetch the book's cover image
        const coverImage = await fetchBookCover(randomBook.title);

        // Sanitize the book's description
        const sanitizedDesc = sanitizeDescription(randomBook.description);

        // Truncate the description to a suitable length (e.g., 100 characters)
        const truncatedDesc = truncateDescription(sanitizedDesc, 100);

        // Create the `todaysBook` object
        const todaysBook = {
            id: randomBook._id,
            title: randomBook.title,
            author: randomBook.authors.join(', '),
            desc: `${truncatedDesc} <a href="${randomBook.url}" target="_blank" style="color: #b49a4b;">Read more</a>`,
            image: coverImage,
            url: randomBook.url
        };
        res.json(todaysBook);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /byGenre - Fetch books by genre
router.get('/byGenre', async (req, res) => {
    try {
        const genre = req.query.genre;
        const limit = parseInt(req.query.limit) || 0;
        if (!genre) {
            return res.status(400).json({ message: 'Genre is required' });
        }
        // Normalize the genre for case-insensitive search
        const books = await Book.find({ genres: { $regex: new RegExp(genre, 'i') } }).limit(limit);
        // Fetch covers for each book
        const booksWithCovers = await Promise.all(
            books.map(async (book) => {
                const coverImage = await fetchBookCover(book.title);
                return {
                    ...book.toObject(),
                    image: coverImage,
                    author: book.authors.join(', ')
                };
            })
        );
        res.json({
            data: booksWithCovers,
            meta: {
                genre: genre,
                limit: limit,
                total: books.length
            }
        });
    } catch (err) {
        console.error('Error fetching books by genre:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /search - Search for books
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        // Search for books by title or author
        const books = await Book.find({
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { authors: { $elemMatch: { $regex: new RegExp(query, 'i') } } }
            ]
        });
        const results = books.map(book => ({
            title: book.title,
            author: book.authors.join(', '),
            id: book._id
        }));
        res.json({
            data: results,
            meta: {
                query: query,
                total: books.length
            }
        });
    } catch (err) {
        console.error('Error searching books:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const coverImage = await fetchBookCover(book.title);
        const bookWithCover = {
            ...book.toObject(),
            image: coverImage
        };
        res.json(bookWithCover);
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
