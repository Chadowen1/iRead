import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
    firstName: { type: String, required: true },
    familyName: { type: String, required: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    favoriteGenres: [String],
    myLibrary: [{
        bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
        addedAt: { type: Date, default: Date.now }
    }],
    myQuotes: [{
        quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
        addedAt: { type: Date, default: Date.now }
    }]
});

// Book Schema
const bookSchema = new Schema({
    title: { type: String, required: true },
    seriesTitle: { type: String, default: null },
    seriesReleaseNumber: { type: Number, default: null },
    authors: [{ type: String }],
    publisher: { type: String, default: null },
    language: { type: String, default: null },
    description: { type: String, default: null },
    numPages: { type: Number, default: null },
    format: { type: String, default: null },
    genres: [{ type: String }],
    publicationDate: { type: Date, default: null },
    ratingScore: { type: Number, default: null },
    numRatings: { type: Number, default: null },
    numReviews: { type: Number, default: null },
    currentReaders: { type: Number, default: null },
    wantToRead: { type: Number, default: null },
    price: { type: Number, default: null },
    url: { type: String, default: null }
});

// Quote Schema
const quoteSchema = new Schema({
    quote: { type: String, required: true },
    author: { type: String, required: true },
    tags: [{ type: String }]
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Quote = mongoose.model('Quote', quoteSchema);

export { User, Book, Quote };
