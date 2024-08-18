import express from 'express';
import { User } from '../models/models.js';
import { Book } from '../models/models.js';
import requireAuth from '../middleware/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

async function fetchBookCover(title) {
    try {
        const response = await axios.get('https://openlibrary.org/search.json', {
            params: { title: title }
        });
        const coverId = response.data.docs[0]?.cover_i;
        const coverImage = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';
        return coverImage;
    } catch (error) {
        console.error('Error fetching book cover:', error);
        return '';
    }
}

router.post('/wantToRead', requireAuth, async (req, res) => {
    const { bookId } = req.body;
    const email = req.user.email;
    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const bookIndex = user.myLibrary.findIndex((entry) => entry.bookId.toString() === bookId);
        if (bookIndex > -1) {
            // Book is already in the library, remove it
            user.myLibrary.splice(bookIndex, 1);
            await user.save();
            return res.status(200).json({ message: 'Book removed from myLibrary' });
        } else {
            // Book is not in the library, add it
            user.myLibrary.push({ bookId, addedAt: new Date() });
            await user.save();
            return res.status(200).json({ message: 'Book added to myLibrary' });
        }
    } catch (error) {
        console.error('Error updating myLibrary:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/isInLibrary/:bookId', requireAuth, async (req, res) => {
    const { bookId } = req.params;
    const email = req.user.email;

    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isInLibrary = user.myLibrary.some((entry) => entry.bookId.toString() === bookId);
        return res.status(200).json({ isInLibrary });
    } catch (error) {
        console.error('Error checking library status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/myLibrary', requireAuth, async (req, res) => {
    const email = req.user.email;

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookIds = user.myLibrary.map(entry => entry.bookId);
        const books = await Book.find({ _id: { $in: bookIds } }).exec();

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

        return res.status(200).json(booksWithCovers);
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
