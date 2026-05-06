import sql from '../config/db.js'

// get all users
export const getUsers = async (c) => {
    try {
        const users = await sql`SELECT * FROM users`
        return c.json(users)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong!" }, 500)
    }
    
};

// get user by id
export const getUserById = async (c) => {
    try {
        const id = c.req.param("id")
        const [user] = await sql`SELECT * FROM users WHERE id = ${id}`
        if (!user) return c.json({ message: "User not found" }, 404)
        return c.json(user)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// create user
export const createUser = async (c) => {
    try {
        const body = await c.req.json()
        const { username, email, password, bio, profile_pic } = body

        const [newUser] = await sql`
            INSERT INTO users (username, email, password, bio, profile_pic)
            VALUES (${username}, ${email}, ${password}, ${bio}, ${profile_pic})
            RETURNING *
        `
        return c.json(newUser, 201)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// delete user
export const deleteUser = async (c) => {
    try {
        const id = c.req.param("id")
        const [user] = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`
        if (!user) return c.json({ message: "User not found" }, 404)
        return c.json({ message: "User deleted" })

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};