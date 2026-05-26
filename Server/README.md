# BookMyVenue Backend Server

A production-ready, highly structured Node.js / Express backend server built to enforce separation of concerns, secure authentication, declarative request validation, centralized error catching, rate limiting, and background processing.

---

## Architecture Layout

```text
Server/
├── .env                           # Environment configuration values
├── .gitignore                     # Git track exclusions
├── package.json                   # Dependencies and npm scripts
├── server.js                      # Application launcher (DB conn, process error catches)
└── src/
    ├── app.js                     # Express app setup (security headers, CORS, rate limits, root paths)
    ├── config/
    │   ├── db.js                  # Database connection pool setup (Mongoose)
    │   ├── logger.js              # Central logging engine setup (Winston)
    │   └── queue.js               # Redis client connection setup (ioredis)
    ├── constants/
    │   ├── errorCodes.js          # App-specific internal error code maps
    │   └── httpStatusCodes.js     # Standard HTTP status code lookup maps
    ├── controllers/
    │   ├── auth.controller.js     # Extracts input and returns success JSON responses
    │   └── user.controller.js     # Manages user-specific transport mappings
    ├── middlewares/
    │   ├── auth.middleware.js     # Verifies JWT validation and hydrates user request scope
    │   ├── error.middleware.js    # Global centralized operational/panic handler middleware
    │   └── validate.middleware.js # Express Joi schema validation middleware
    ├── models/
    │   └── user.model.js          # User database schema & password hash hooks (Mongoose)
    ├── routes/
    │   ├── index.js               # Base router mapping versioned API entryways
    │   ├── auth.routes.js         # Public authentication pathways (/register, /login)
    │   └── user.routes.js         # Protected user details pathways
    ├── services/
    │   ├── auth.service.js        # Auth calculations, password checks, token signing
    │   ├── user.service.js        # Profile modification & Worker Thread triggers
    │   └── queue.service.js       # Background job publisher (BullMQ)
    ├── utils/
    │   ├── asyncHandler.js        # Promise catcher wrapper
    │   ├── crypto.js              # JWT sign/verify, bcrypt hooks, AES symmetric encryption
    │   └── formatters.js          # Standardized response json wrappers
    ├── validators/
    │   ├── auth.validator.js      # Joi register/login schemas
    │   └── user.validator.js      # Joi user profile schemas
    └── workers/
        └── processing.worker.js   # Native Node.js Worker Thread for CPU-bound computations
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (running instance)
- [Redis](https://redis.io/) (running instance for background queues, optional for base routes)

### Setup Steps
1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   Create a `.env` file in the root of the server folder and configure your local variables:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/bookmyvenue
   JWT_SECRET=super_secret_jwt_key_that_is_long_and_complex_12345
   JWT_EXPIRE=24h
   ENCRYPTION_KEY=603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```

### Execution Scripts
- **Development mode** (runs via `nodemon` with automatic hot-reloading):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## API Endpoints Reference

### 1. Health Checks
- **GET** `/api/v1/health`
  - *Access*: Public
  - *Response*: Returns the server runtime status.

### 2. Authentication Route Handlers
- **POST** `/api/v1/auth/register`
  - *Access*: Public
  - *Payload*: `{ "name": "...", "email": "...", "password": "..." }`
  - *Response*: Creates user record and returns bearer JWT token.
- **POST** `/api/v1/auth/login`
  - *Access*: Public
  - *Payload*: `{ "email": "...", "password": "..." }`
  - *Response*: Verifies password, returns bearer JWT token.

### 3. User & Admin Route Handlers
- **GET** `/api/v1/users/profile`
  - *Access*: Private (Requires `Authorization: Bearer <token>`)
  - *Response*: Returns current authenticated profile details.
- **PUT** `/api/v1/users/profile`
  - *Access*: Private (Requires `Authorization: Bearer <token>`)
  - *Payload*: `{ "name": "...", "email": "..." }`
  - *Response*: Updates and returns modified user records.
- **POST** `/api/v1/users/heavy-task`
  - *Access*: Private (Requires admin role authorization)
  - *Payload*: `{ "iterations": 50000000 }`
  - *Response*: Triggers an isolated native Node.js Worker Thread calculation.
