import redis from "redis"

export const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Use Redis URL from environment variables or local
});

redisClient.on("connect", () => console.log("✅ Redis connected successfully"));
redisClient.on("error", (err) => console.error("❌ Redis connection error:", err));

(async () => {
  await redisClient.connect(); // Connect Redis
})();

