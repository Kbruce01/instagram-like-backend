import { Hono } from 'hono'
import { getFollowers, getFollowing, followUser, unfollowUser } from '../controllers/followersController.js'

const followerRoutes = new Hono()

followerRoutes.get("/:followingId", getFollowers)
followerRoutes.get("/following/:followerId", getFollowing)
followerRoutes.post("/", followUser)
followerRoutes.delete("/", unfollowUser)

export default followerRoutes