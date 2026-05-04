import { posts } from '../data/posts.js'
import { followers } from '../data/followers.js'
import redis from '../config/redis.js'

//get feed
export const getFeed = async (c) => {

    // step 1 - get logged in user id from token
    const payload = c.get("jwtPayload")
    const userId = payload.userId

    //caching with redis 
    const cacheKey = `feed:${userId}`
    const cachedFeed = await redis.get(cacheKey)

    if (cachedFeed) {
        console.log("cache hit")
        return c.json(JSON.parse(cachedFeed))
    }

    console.log("Cache miss - fetching from database")

    // step 2 - get all users the logged in user follows
    const following = followers.filter(f => f.followerId === userId)
    if (!following.length) return c.json({ message: "You are not following anyone" }, 404)

    // step 3 - get all posts from followed users
    const feedPosts = posts.filter(p => following.some(f => f.followingId === p.userId))
    if (!feedPosts.length) return c.json({ message: "No posts in your feed" }, 404)

    // step 4 - sort by newest first
    feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // step 5 - paginate
    const page = Number(c.req.query("page")) || 1
    const limit = Number(c.req.query("limit")) || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedPosts = feedPosts.slice(start, end)

   // save the the data and call it later 
    const response = {
        page,
        limit,
        total: feedPosts.length,
        posts: paginatedPosts
    }

    //store in cache for 60 secs 
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60)
    return c.json(response)
};