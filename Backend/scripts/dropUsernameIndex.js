const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traffic_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const dropIndex = async () => {
    await connectDB();
    try {
        const collection = mongoose.connection.collection('users');
        // List indexes to confirm
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        const usernameIndexInfo = indexes.find(idx => idx.name === 'username_1');

        if (usernameIndexInfo) {
            await collection.dropIndex('username_1');
            console.log('Successfully dropped "username_1" index.');
        } else {
            console.log('"username_1" index not found. Checking for other potential conflicting indexes...');
            // Sometimes it might be named differently but defined on username
            // But usually it is fieldname_1
        }

    } catch (err) {
        console.error('Error dropping index:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

dropIndex();
