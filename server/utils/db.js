import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URL;
        await mongoose.connect(mongoURI, {
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
