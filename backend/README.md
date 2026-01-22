# AI Crypto Advisor - Backend

Node.js + Express + TypeScript + Prisma backend for the AI Crypto Advisor application.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod
- **Password Hashing**: Bcrypt

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/         # Route handlers (thin layer)
│   ├── middleware/          # Auth, validation, error handling
│   ├── routes/              # API endpoint definitions
│   ├── services/            # Business logic + external API calls
│   ├── schemas/             # Zod validation schemas
│   ├── types/               # TypeScript type definitions
│   └── lib/                 # Utilities (Prisma client, etc.)
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
└── tsconfig.json            # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running (local or cloud)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Add your API keys (CoinGecko, CryptoPanic, OpenRouter/HuggingFace)
   - Set a secure `JWT_SECRET`

3. **Set up database**:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Create and run migrations
   npm run prisma:migrate
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:push` - Push schema changes directly to DB (dev only)

## 🗄 Database Schema

Will be defined in `prisma/schema.prisma`. Key models:

- **User** - Authentication and user preferences
- **Vote** - User feedback on dashboard sections

## 🔌 External APIs

- **CoinGecko** - Real-time crypto prices
- **CryptoPanic** - Crypto news aggregation
- **OpenRouter/HuggingFace** - AI-generated insights

## 🔒 Authentication Flow

1. User registers/logs in → Receives JWT token
2. Token stored in localStorage (frontend)
3. Token sent in Authorization header for protected routes
4. Middleware validates token and attaches user to request

## 📝 Next Steps

1. Define Prisma schema for User and Vote models
2. Implement authentication endpoints (register, login)
3. Create services for external APIs
4. Build dashboard data aggregation logic
5. Implement voting system

## 🤝 Development Principles

- **Type Safety** - No `any` types, strict TypeScript
- **Validation** - Zod schemas for all inputs
- **Error Handling** - Proper error messages and status codes
- **Separation of Concerns** - Controllers → Services → Database
- **Clean Code** - Single responsibility, DRY principles
