const redis = require('redis');

// Create Redis client
const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
client.connect().catch(console.error);

// Store data in Redis
const storeData = async (key, value, ttl = null) => {
    try {
        if (ttl) {
            await client.set(key, value, { EX: ttl });
        } else {
            await client.set(key, value);
        }
        return { success: true, key };
    } catch (error) {
        console.error('Redis store error:', error);
        throw new Error('Failed to store data in Redis');
    }
};

// Get data from Redis
const getData = async (key) => {
    try {
        const value = await client.get(key);
        if (value === null) {
            throw new Error('Key not found');
        }
        return { key, value };
    } catch (error) {
        console.error('Redis get error:', error);
        throw error;
    }
};

// Delete data from Redis
const deleteData = async (key) => {
    try {
        const result = await client.del(key);
        if (result === 0) {
            throw new Error('Key not found');
        }
        return { success: true, key };
    } catch (error) {
        console.error('Redis delete error:', error);
        throw error;
    }
};

// Get TTL for a key
const getTTL = async (key) => {
    try {
        const ttl = await client.ttl(key);
        if (ttl === -2) {
            throw new Error('Key not found');
        }
        return { key, ttl };
    } catch (error) {
        console.error('Redis TTL error:', error);
        throw error;
    }
};

// List all keys
const listKeys = async () => {
    try {
        const keys = await client.keys('*');
        return { keys };
    } catch (error) {
        console.error('Redis keys error:', error);
        throw new Error('Failed to list keys');
    }
};

module.exports = {
    storeData,
    getData,
    deleteData,
    getTTL,
    listKeys
};
