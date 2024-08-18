import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import { Book, Quote } from '../models/models.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL;

async function connectDB() {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('MongoDB connected');
}

async function importBooks() {
    const books = [];
    fs.createReadStream('../data/books.csv')
        .pipe(csv())
        .on('data', (row) => {
            try {
                // Clean up the genres field
                const genres = row.genres
                    ? row.genres
                        .replace(/'/g, '"') // Replace single quotes with double quotes
                        .replace(/^\[|\]$/g, '') // Remove leading and trailing brackets
                        .trim() // Trim whitespace
                    : '[]'; // Default to empty array if genres is missing
                
                const parsedGenres = (() => {
                    try {
                        return genres ? JSON.parse(`[${genres}]`) : [];
                    } catch (error) {
                        console.error('Error parsing genres:', error);
                        return [];
                    }
                })();
                
                books.push({
                    title: row.title,
                    seriesTitle: row.series_title || null,
                    seriesReleaseNumber: row.series_release_number ? (isNaN(Number(row.series_release_number)) ? null : Number(row.series_release_number)) : null,
                    authors: row.authors ? row.authors.split(',') : [],
                    publisher: row.publisher || null,
                    language: row.language || null,
                    description: row.description || null,
                    numPages: row.num_pages ? (isNaN(Number(row.num_pages)) ? null : Number(row.num_pages)) : null,
                    format: row.format || null,
                    genres: parsedGenres,
                    publicationDate: row.publication_date ? new Date(row.publication_date) : null,
                    ratingScore: row.rating_score ? (isNaN(Number(row.rating_score)) ? null : Number(row.rating_score)) : null,
                    numRatings: row.num_ratings ? (isNaN(Number(row.num_ratings)) ? null : Number(row.num_ratings)) : null,
                    numReviews: row.num_reviews ? (isNaN(Number(row.num_reviews)) ? null : Number(row.num_reviews)) : null,
                    currentReaders: row.current_readers ? (isNaN(Number(row.current_readers)) ? null : Number(row.current_readers)) : null,
                    wantToRead: row.want_to_read ? (isNaN(Number(row.want_to_read)) ? null : Number(row.want_to_read)) : null,
                    price: row.price ? (isNaN(Number(row.price)) ? null : Number(row.price)) : null,
                    url: row.url || null
                });
            } catch (err) {
                console.error('Error processing row:', err);
            }
        })
        .on('end', async () => {
            try {
                await Book.insertMany(books);
                console.log('Books imported');
            } catch (err) {
                console.error('Error importing books:', err);
            }
        });
}

async function importQuotes() {
    const filePath = '../data/quotes.json';
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const quotes = JSON.parse(data).map(row => ({
            quote: row.Quote || null,
            author: row.Author || null,
            tags: row.Tags || []
        }));
        
        await Quote.insertMany(quotes);
        console.log('Quotes imported');
    } catch (err) {
        console.error('Error importing quotes:', err);
    }
}

async function main() {
    try {
        await connectDB();
        await importBooks();
        await importQuotes();
    } catch (err) {
        console.error('Error during import:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main().catch(err => console.error(err));