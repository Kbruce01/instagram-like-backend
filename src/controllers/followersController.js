import { followers } from "../data/followers.js"
import { createNotification } from './notificationsController.js'

//getfollowers
export const getFollowers = (c) => {
    const followingId = Number(c.req.param("followingId"))

    const follower = followers.filter(follower => follower.followingId === followingId)
    if (!follower.length) return c.json({ message: "No followers obtaines" })
    
        return c.json(follower)
};

//get following 
export const getFollowing = (c) => {
    const followerId = Number(c.req.param("followerId"))

    const following = followers.filter(f => f.followerId === followerId)
    if (!following.length) return c.json({ message: "Not following anyone" }, 404)

    return c.json(following)
};

//follow a user 
export const followUser = async (c) => {
    const body = await c.req.json()
    const { followerId, followingId } = body

    
    const existingFollow = followers.find(f => f.followerId === followerId && f.followingId === followingId)
    if (existingFollow) return c.json({ message: "Already following" }, 400)

    const newFollow = {
        id: followers.length + 1,
        followerId,
        followingId,
        createdAt: new Date().toISOString()
    }

    followers.push(newFollow)

    createNotification(followingId, followerId, "follow", null)
    return c.json(newFollow, 201)
};

//unfollow a user 
export const unfollowUser = async (c) => {
    const body = await c.req.json()
    const { followerId, followingId } = body

    const index = followers.findIndex(f => f.followerId === followerId && f.followingId === followingId)
    if (index === -1) return c.json({ message: "User already unfollowed" }, 404)

    followers.splice(index, 1)

    return c.json({ message: 'User unfollowed sucessfully' })
};
