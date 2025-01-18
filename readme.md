# Express TypeScript Backend Boilerplate

A production-ready Express.js backend boilerplate with TypeScript support, comprehensive middleware setup, testing infrastructure, and best practices for security and performance.

## Features

- 🚀 Express.js with TypeScript
- 🔒 Built-in security middleware (helmet, rate limiting)
- 📝 Swagger API documentation
- 🧪 Jest testing setup
- 📊 Prometheus metrics
- 📝 Structured logging (Winston/Pino)
- 💾 In-memory caching with Cacheable
- 🗄️ Prisma ORM with PostgreSQL
- ⚡️ Request timing and monitoring
- 🔍 ESLint + Prettier setup
- 🏗️ TypeScript type checking

## Getting Started

1. Clone this repository
2. Copy `.env.template` to `.env` and update the values
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   # or
   yarn prisma:generate
   ```
5. Push database schema:
   ```bash
   npm run prisma:push
   # or
   yarn prisma:push
   ```
6. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
├── configurations/     # App configuration files
├── database/          # Database related files
│   ├── client.js      # Prisma client singleton
│   └── repository.js  # Repository pattern implementation
├── prisma/           # Prisma configuration
│   └── schema.prisma # Database schema
├── middleware/        # Express middleware
│   ├── cache/        # Caching middleware (using Cacheable)
│   ├── core/         # Core middleware (error handling, etc.)
│   ├── monitoring/   # Request monitoring
│   ├── security/     # Security middleware
│   └── validation/   # Request validation
├── services/         # Business logic services
├── types/           # TypeScript type definitions
├── util/            # Utility functions
├── v1/              # API routes (versioned)
└── tests/           # Test files
```

## Database Implementation

This project uses Prisma ORM with a repository pattern for database operations, providing type safety and a clean abstraction layer.

### Database Schema
Schemas are defined in `prisma/schema.prisma`:
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String
  // ... other fields
}
```

### Database Connection
```javascript
import database from './database/client';

// Connect to database
await database.connect();

// Get Prisma client
const prisma = database.getClient();
```

### Repository Usage
```javascript
import repository from './database/repository';

// Create a new user
const user = await repository.create('user', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Find users with relations
const users = await repository.findMany('user', 
  { role: 'ADMIN' },
  { include: { tokens: true } }
);

// Update user
const updated = await repository.updateOne('user',
  { id: userId },
  { name: 'Jane Doe' }
);

// Use transactions
await repository.transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  const token = await tx.token.create({ ... });
});
```

### Prisma Studio
To view and edit your database with a GUI:
```bash
npm run prisma:studio
# or
yarn prisma:studio
```

## Available Scripts

- `yarn start`: Start production server
- `yarn dev`: Start development server with hot reload
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:push`: Push schema changes to database
- `yarn prisma:migrate`: Create and apply migrations
- `yarn prisma:studio`: Open Prisma Studio GUI

## Caching Implementation

This project uses [Cacheable](https://github.com/jaredwray/cacheable) for efficient in-memory caching. The implementation includes:

### Cache Service
A wrapper service (`services/cache.service.js`) that provides:
- Key-value storage with TTL
- Automatic cache invalidation
- Memory management (max 1000 items by default)
- Function result caching with `wrap()`

### Cache Middleware
Express middleware for route caching:
```javascript
import { cacheMiddleware } from '../middlewares/cache.middleware.js';

// Cache route for 1 hour
router.get('/users', cacheMiddleware(3600), userController.getUsers);

// Use default cache duration
router.get('/products', cacheMiddleware(), productController.getProducts);
```

### Direct Cache Usage
```javascript
import cacheService from '../services/cache.service.js';

// Cache function results
const users = await cacheService.wrap('users', () => User.find(), 3600);

// Manual cache operations
await cacheService.set('key', value, ttl);
const value = await cacheService.get('key');
await cacheService.del('key');
```

## Environment Variables

See `.env.template` for required environment variables.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

ISC