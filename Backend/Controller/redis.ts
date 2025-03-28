import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME ,
    password: process.env.REDIS_PASSWORD,  
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379 || 19701
    }
});

// Error handling
client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis Client Connected'));
client.on('reconnecting', () => console.log('Redis Client Reconnecting'));
client.on('end', () => console.log('Redis Client Connection Ended'));

// Connect to Redis
const connectRedis = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Successfully connected to Redis');
        }
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }
};

// Initialize connection
connectRedis();

// Export the client and connection function
export const redis = client;
export { connectRedis };

// Test function
export async function testRedis() {
    try {
        await connectRedis();
        await redis.set('test_key', 'Hello, Redis!');
        const value = await redis.get('test_key');
        console.log('Redis Test Value:', value);
        return value;
    } catch (error) {
        console.error('Redis Test Error:', error);
        throw error;
    }
}