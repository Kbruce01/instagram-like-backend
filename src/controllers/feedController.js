import sql from '../config/db.js'
import redis from '../config/redis.js'

export const getFeed = async (c) => {
    
    try {
        const payload = c.get("jwtPayload")
        const userId = payload.userId

        // check cache first
        const cacheKey = `feed:${userId}`
        const cachedFeed = await redis.get(cacheKey)
        if (cachedFeed) {
            console.log("cache hit")
            return c.json(JSON.parse(cachedFeed))
        }

        console.log("Cache miss - fetching from database")

        // step 2 - get all users the logged in user follows
        const following = await sql`SELECT * FROM followers WHERE follower_id = ${userId}`
        if (!following.length) return c.json({ message: "You are not following anyone" }, 404)

        // step 3 - get all posts from followed users
        const followingIds = following.map(f => f.following_id)
        const feedPosts = await sql`SELECT * FROM posts WHERE user_id = ANY(${followingIds})`
        if (!feedPosts.length) return c.json({ message: "No posts in your feed" }, 404)

        // step 4 - sort by newest first
        feedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        // step 5 - paginate
        const page = Number(c.req.query("page")) || 1
        const limit = Number(c.req.query("limit")) || 10
        const start = (page - 1) * limit
        const end = start + limit
        const paginatedPosts = feedPosts.slice(start, end)

        const response = {
            page,
            limit,
            total: feedPosts.length,
            posts: paginatedPosts
        }

        // store in cache for 60 seconds
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60)
        return c.json(response)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};