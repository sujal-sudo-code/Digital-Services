const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        // If no URI or using default local URI, try in-memory server as fallback
        if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
            try {
                // Try connecting to local MongoDB first
                if (uri) {
                    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
                    console.log('✅ MongoDB connected (local):', mongoose.connection.host);
                    return;
                }
            } catch {
                console.log('⚠️  Local MongoDB not available, starting in-memory server...');
            }

            // Fallback to in-memory MongoDB
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log('✅ Using in-memory MongoDB (data will not persist across restarts)');
        }

        await mongoose.connect(uri);
        console.log('✅ MongoDB connected:', mongoose.connection.host);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    process.exit(0);
});

module.exports = connectDB;
