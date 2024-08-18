import express from 'express';
import quotesRoutes from './quotes.js';
import booksRoutes from './books.js';
import authRoutes from './auth.js';
import authorsRoutes from './authors.js';
import userRoutes from './user.js';

const router = express.Router();

router.use('/quotes', quotesRoutes);
router.use('/books', booksRoutes);
router.use('/auth', authRoutes);
router.use('/authors', authorsRoutes);
router.use('/user', userRoutes);

export default router;
