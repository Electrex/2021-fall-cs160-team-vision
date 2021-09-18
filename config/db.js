const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// connect to MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('Mongodb connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;