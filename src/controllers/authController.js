import { sign } from 'hono/jwt'
import sql from '../config/db.js'
import bcrypt from 'bcryptjs'

// register
export const register = async (c) => {
    try {
        const body = await c.req.json()
        const { username, email, password } = body

        const [existingUser] = await sql`SELECT * FROM users WHERE email = ${email}`
        if (existingUser) return c.json({ message: "User already exists" }, 400)

        const hashedPassword = await bcrypt.hash(password, 10)

        const [newUser] = await sql`
            INSERT INTO users (username, email, password)
            VALUES (${username}, ${email}, ${hashedPassword})
            RETURNING *
        `

        const { password: _, ...userWithoutPassword } = newUser
        const token = await sign({ userId: newUser.id }, process.env.JWT_SECRET)
        return c.json({ user: userWithoutPassword, token }, 201)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Failed to signup, something went wrong!" }, 500)
    }
};

// login
export const login = async (c) => {
    try {
        const body = await c.req.json()
        const { email, password } = body

        const [user] = await sql`SELECT * FROM users WHERE email = ${email}`
        if (!user) return c.json({ message: "User not found" }, 404)

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return c.json({ message: "Invalid password" }, 401)

        const token = await sign({ userId: user.id }, process.env.JWT_SECRET)
        const { password: _, ...userWithoutPassword } = user
        return c.json({ user: userWithoutPassword, token })

    } catch (error) {
        console.error(error)
        return c.json({ message: "Login failed, something went worng!" }, 500)
    }
};