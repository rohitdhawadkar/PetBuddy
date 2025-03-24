import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

export async function testRedis() {
  try {
    await redis.set("test_key", "Hello, Redis!");
    const value = await redis.get("test_key");
    console.log("Redis Value:", value);
  } catch (e) {
    console.log("error occured", e);
  }
}
