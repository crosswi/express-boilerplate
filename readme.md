# Express TypeScript Backend Boilerplate

A production-ready Express.js backend boilerplate with comprehensive middleware setup, testing infrastructure, and best practices for security and performance.

## Features

- 🚀 Express.js with Node.js
- 🔒 Built-in security middleware (helmet, xss-clean, rate limiting)
- 📝 Swagger API documentation
- 🧪 Jest testing setup with coverage reporting
- 📝 Structured logging (Winston)
- 💾 In-memory caching with Cacheable
- 🗄️ Prisma ORM (v5.10.0) with database support
- ⚡️ Request monitoring with Morgan
- 🔍 ESLint + Prettier setup
- 🚦 PM2 process manager for production
- 🔐 JWT authentication with Passport
- 📧 Email support with Nodemailer
- 🌐 CORS enabled
- 🗜️ Response compression

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
├── src/              # Source code
├── prisma/           # Prisma configuration and schema
├── tests/            # Test files
├── .env.template     # Environment variables template
├── ecosystem.config.json  # PM2 configuration
├── jest.config.cjs   # Jest configuration
├── .eslintrc.cjs    # ESLint configuration
├── .prettierrc.cjs  # Prettier configuration
└── babel.config.cjs # Babel configuration
```

## Available Scripts

- `yarn start`: Start production server with PM2
- `yarn dev`: Start development server with hot reload
- `yarn test`: Run tests
- `yarn test:watch`: Run tests in watch mode
- `yarn coverage`: Generate test coverage report
- `yarn lint`: Run ESLint
- `yarn lint:fix`: Fix ESLint issues
- `yarn prettier`: Check code formatting
- `yarn prettier:fix`: Fix code formatting
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:push`: Push schema changes to database
- `yarn prisma:migrate`: Create and apply migrations
- `yarn prisma:studio`: Open Prisma Studio GUI

## Environment Variables

Required environment variables are documented in `.env.template`. Make sure to copy this file to `.env` and update the values accordingly.

## Authentication

The project uses JWT (JSON Web Tokens) with Passport.js for authentication. Protected routes can be implemented using the JWT strategy.

## Caching

Built-in caching support using Cacheable provides:
- In-memory key-value storage with TTL
- Automatic cache invalidation
- Memory management
- Function result caching

## Testing

Jest is configured for testing with:
- Coverage reporting
- Supertest for API testing
- Node-mocks-http for request/response mocking
- Faker for generating test data

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT