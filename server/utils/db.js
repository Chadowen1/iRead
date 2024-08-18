import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb://root:root@192.168.1.19:27017/iReadBase?authSource=admin';
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
