import { Hono } from 'hono'
import { getFollowers, getFollowing, followUser, unfollowUser } from '../controllers/followersController.js'
import { authMiddleware } from '../middleware/auth.js'

const followerRoutes = new Hono()

followerRoutes.get("/:followingId", getFollowers)
followerRoutes.get("/following/:followerId", getFollowing)
followerRoutes.post("/", authMiddleware, followUser)
followerRoutes.delete("/", authMiddleware, unfollowUser)

export default followerRoutes