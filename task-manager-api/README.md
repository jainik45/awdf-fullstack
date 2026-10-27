# Task Manager API

**Student:** Jainik Ghetiya  
**Student ID:** 24IT024  
**GitHub Username:** [jainik45](https://github.com/jainik45)  
**Subject:** ITUE301 Advanced Web Development Frameworks  

A high-performance Node.js + Express + MongoDB backend implementing Practicals 4, 5, 7, 9, 10, and 11.

---

## Practicals Included

1. **Practical 4 – Express Middleware Pipeline**: Custom logging, content-type enforcement (415), robust JSON 404 handling, centralized error handling, and ObjectId validation.
2. **Practical 5 – MongoDB with Mongoose**: Mongoose schemas and models, validation hooks, async/await controllers, and full CRUD task endpoints.
3. **Practical 7 – JWT Authentication**: Secure user registration, bcrypt password hashing, JWT token issuance, auth middleware, and user-scoped task access.
4. **Practical 9 – In-Memory Caching (node-cache)**: Per-user caching for GET `/tasks` and GET `/tasks/:id`, cache hit/miss headers (`X-Cache`), cache invalidation on write (POST, PUT, DELETE), and `/debug/cache` telemetry.
5. **Practical 10 – Asynchronous Event Handling (EventEmitter)**: Decoupled domain events (`task-created`, `task-deleted`, `error`), background notification handlers with artificial 2-second delay emitting AFTER response.
6. **Practical 11 – Docker & Docker Compose**: Multi-container containerization with MongoDB, Backend API, and Nginx-served Frontend.

---

## Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/taskdb` |
| `JWT_SECRET` | Secret key for JWT signing | `change_this_secret` |
| `PORT` | HTTP Server port | `5000` |

---

## API Endpoints

### Authentication (Practical 7)
- `POST /register` – Register a new user (`{ email, password }`) -> `201 Created` / `409 Conflict` / `400 Validation Error`
- `POST /login` – Authenticate user and receive JWT (`{ email, password }`) -> `200 OK` / `401 Unauthorized`
- `GET /me` – Retrieve currently authenticated user profile (requires `Bearer <token>`) -> `200 OK` / `401 Unauthorized`

### Tasks (Practicals 4, 5, 7, 9, 10)
- `GET /tasks` – Retrieve all tasks owned by authenticated user (cached in memory)
- `GET /tasks/:id` – Retrieve a single task by ID (cached in memory)
- `POST /tasks` – Create a new task (`{ title, description, priority }`) -> invalidates cache, emits `task-created`
- `PUT /tasks/:id` – Update an existing task (`{ title, description, completed, priority }`) -> invalidates cache
- `DELETE /tasks/:id` – Delete a task -> invalidates cache, emits `task-deleted`

### Utilities & Diagnostics
- `GET /test-error` – Triggers test exception demonstrating global error handling -> `500 { error: "Something went wrong" }`
- `GET /debug/cache` – Cache statistics: hits, misses, and cached key count -> `200 OK`

---

## Running the API

### Local Run
```bash
# 1. Install dependencies
npm install

# 2. Start server
node server.js
```

### Running Automated Smoke Tests
```bash
node scripts/smoke-test.js
```

### Seeding Tasks
```bash
node scripts/seedTasks.js demo@example.com
```

---

## Commit History

- `Practical 4: Express middleware pipeline and error handling`
- `Practical 5: MongoDB with Mongoose`
- `Practical 7: JWT authentication on backend`
- `Practical 9: In-memory caching with node-cache`
- `Practical 10: Asynchronous event handling with EventEmitter`
- `Practical 11: Docker and docker-compose`
