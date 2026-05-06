# Instagram-Like Backend API

A RESTful backend API built with Bun and Hono, inspired by Instagram. Features include user authentication, posts, comments, likes, followers, notifications, and a Redis-cached feed.

## Tech Stack

- **Runtime** — Bun
- **Framework** — Hono
- **Database** — PostgreSQL (Supabase)
- **Caching** — Redis (Upstash)
- **Authentication** — JWT + Bcrypt

## Features

- User registration and login with JWT authentication
- Password hashing with Bcrypt
- Create, read, and delete posts
- Like and unlike posts with live likes count
- Comment on posts
- Follow and unfollow users
- Paginated feed from followed users
- Real-time notifications for likes, comments, and follows
- Redis caching for fast feed retrieval
- Protected routes with JWT middleware

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Kbruce01/instagram-like-backend.git
cd instagram-like-backend
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the root directory:

JWT_SECRET=your_jwt_secret
DATABASE_URL=your_supabase_connection_string
REDIS_URL=your_upstash_redis_url

4. Run the server:
```bash
bun run dev
```

Server runs at `http://localhost:8080`

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user (no auth required)
- `POST /api/auth/login` — Login a user (no auth required)

### Users
- `GET /api/users` — Get all users
- `GET /api/users/:id` — Get a single user by id
- `POST /api/users` — Create a user
- `DELETE /api/users/:id` — Delete a user

### Posts
- `GET /api/posts` — Get all posts
- `GET /api/posts/:id` — Get a single post by id
- `GET /api/posts/user/:userId` — Get all posts by a specific user
- `POST /api/posts` — Create a post (auth required)
- `DELETE /api/posts/:id` — Delete a post (auth required)

### Comments
- `GET /api/comments` — Get all comments
- `GET /api/comments/:id` — Get a single comment by id
- `GET /api/comments/post/:postId` — Get all comments for a post
- `POST /api/comments` — Create a comment (auth required)
- `DELETE /api/comments/:id` — Delete a comment (auth required)

### Likes
- `GET /api/likes` — Get all likes
- `GET /api/likes/post/:postId` — Get all likes for a post
- `POST /api/likes` — Like a post (auth required)
- `DELETE /api/likes` — Unlike a post (auth required)

### Followers
- `GET /api/followers/:followingId` — Get all followers of a user
- `GET /api/followers/following/:followerId` — Get all users a user is following
- `POST /api/followers` — Follow a user (auth required)
- `DELETE /api/followers` — Unfollow a user (auth required)

### Feed
- `GET /api/feed` — Get paginated feed from followed users (auth required)
- `GET /api/feed?page=1&limit=10` — Get feed with pagination

### Notifications
- `GET /api/notifications` — Get all notifications for logged in user (auth required)
- `PUT /api/notifications/:id` — Mark a notification as read (auth required)
