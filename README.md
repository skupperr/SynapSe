# SynapSe

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.1-C5D9F1?logo=drizzle&logoColor=white)](https://orm.drizzle.team/)
[![tRPC](https://img.shields.io/badge/tRPC-11.9.0-398CCF?logo=trpc&logoColor=white)](https://trpc.io/)
[![Stream.io](https://img.shields.io/badge/Stream.io-Video_&_Chat-00B4D8?logo=stream&logoColor=white)](https://getstream.io/)
[![Inngest](https://img.shields.io/badge/Inngest-3.52.4-4F46E5?logo=inngest&logoColor=white)](https://www.inngest.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.90.20-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.8.2-222222?logo=auth&logoColor=white)](https://www.better-auth.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/yourusername/meet-ai/blob/main/LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

SynapSe is a full-stack web application that enables users to schedule, conduct, and manage AI-powered video meetings. Users create custom AI agents with personalized instructions, schedule video calls with these agents, and receive real-time transcription, automatic meeting recording, and AI-generated summaries powered by Google Gemini. The platform integrates video conferencing, real-time chat, background job processing, and premium subscription tiers for enhanced functionality.

## Features

- **User Authentication**: Sign up and sign in via GitHub, Google, or email with session management
- **AI Agent Management**: Create, configure, and manage custom AI agents with personalized system instructions
- **Video Meetings**: Schedule and conduct high-quality video calls with AI agents using Stream.io
- **Transcription**: Automatic transcription of meeting conversations
- **Meeting Recording**: Automatic recording and storage of video meetings for later review
- **AI Summaries**: Intelligent meeting summaries generated via Google Gemini with structured notes and key takeaways
- **Real-Time Chat**: Integrated chat functionality during video calls for both user and AI participants
- **Meeting Management**: Dashboard to view, filter, and search past and upcoming meetings
- **Agent Management**: Centralized dashboard for managing AI agents and viewing meeting statistics per agent
- **Search & Filtering**: Advanced search and pagination across meetings and agents
- **Premium Features**: Enhanced functionality available through subscription tiers
- **Responsive UI**: Mobile-friendly interface built with shadcn/UI and Tailwind CSS

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend Framework** | Next.js | 16.1.6 |
| **React** | React | 19.2.3 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **UI Components** | shadcn/UI, Radix UI | Latest |
| **Database** | PostgreSQL (Neon) | Latest |
| **ORM** | Drizzle ORM | 0.45.1 |
| **API** | TRPC | 11.9.0 |
| **Authentication** | Better Auth | 1.8.2 |
| **Payment** | Polar | 1.8.2 |
| **Video/Chat** | Stream.io SDK | 1.32.4 / 9.35.1 |
| **AI** | Google Generative AI | 0.24.1 |
| **Background Jobs** | Inngest | 3.52.4 |
| **State Management** | TanStack React Query | 5.90.20 |
| **Form Handling** | React Hook Form + Zod | 7.71.1 / 4.3.6 |

## Architecture

SynapSe follows a **modern full-stack Next.js architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React 19)                        │
│  - Radix UI Components + shadn/UI + Tailwind CSS                │
│  - TanStack React Query for data fetching                       │
│  - Stream.io Video/Chat UI                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   TRPC + API Routes                             │
│  - tRPC Procedures (agents, meetings, premium)                  │
│  - Next.js API Routes (/api/auth, /api/webhook, etc.)           │
│  - Better Auth Integration                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                          │
│  - Bot Agents with Inngest                                      │
│  - Stream.io Tokenization                                       │
│  - Google Gemini Integration                                    │
│  - Transcript Processing                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Data Persistence                              │
│  - PostgreSQL (Neon)                                            │
│  - Drizzle ORM                                                  │
│  - Tables: user, session, account, verification, agents,        │
│    meetings                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Key Services:**
- **Stream.io**: Video conferencing, chat, and real-time communication
- **Google Gemini**: AI-powered meeting summaries and transcription processing
- **Inngest**: Background job orchestration for meeting processing and summarization
- **Polar**: Payment and subscription management
- **Better Auth**: Unified authentication for multiple OAuth providers

## Prerequisites

Before running SynapSe locally, ensure you have:

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9+ or **yarn** v3.6+
- **PostgreSQL Database**: Access to a PostgreSQL instance (Neon recommended for development)
- **API Keys/Credentials**:
  - GitHub OAuth app credentials
  - Google OAuth credentials
  - Google Generative AI API key
  - Stream.io API key and secret
  - OpenAI API key (if using advanced features)
  - Polar access token (for payments)
  - Inngest API key (for background jobs)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/skupperr/SynapSe.git
cd synapse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stream.io Video
NEXT_PUBLIC_STREAM_VIDEO_API_KEY="your-stream-video-api-key"
STREAM_VIDEO_SECRET_KEY="your-stream-video-secret"

# Stream.io Chat
NEXT_PUBLIC_STREAM_CHAT_API_KEY="your-stream-chat-api-key"
STREAM_CHAT_SECRET_KEY="your-stream-chat-secret"

# AI and APIs
GOOGLE_API_KEY="your-google-gemini-api-key"
OPENAI_API="your-openai-api-key"

# Payments
POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_SERVER="sandbox"  # or production
```

### 4. Push Database Schema

Initialize the database with the Drizzle schema:

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). The homepage redirects to `/meetings` after authentication.

## Configuration

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `BETTER_AUTH_SECRET` | Auth secret for session encryption | Random 32-character string |
| `BETTER_AUTH_URL` | Auth callback URL | `http://localhost:3000` |
| `NEXT_PUBLIC_DOMAIN` | Public domain for app URLs | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID | Obtained from GitHub Settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret | Obtained from GitHub Settings |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Obtained from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Obtained from Google Cloud Console |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Stream.io video API key (public) | From Stream.io dashboard |
| `STREAM_VIDEO_SECRET_KEY` | Stream.io video secret key | From Stream.io dashboard |
| `NEXT_PUBLIC_STREAM_CHAT_API_KEY` | Stream.io chat API key (public) | From Stream.io dashboard |
| `STREAM_CHAT_SECRET_KEY` | Stream.io chat secret key | From Stream.io dashboard |
| `GOOGLE_API_KEY` | Google Generative AI API key | From Google AI Studio |
| `OPENAI_API` | OpenAI API key for advanced features | From OpenAI account |
| `POLAR_ACCESS_TOKEN` | Polar payment service token | From Polar dashboard |
| `POLAR_SERVER` | Polar environment | `sandbox` or `production` |

### Database Configuration

The project uses Drizzle ORM with PostgreSQL. Configuration is in [drizzle.config.ts](drizzle.config.ts):

```typescript
{
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: './db/schema.ts',
  out: './drizzle',
}
```

## Usage

### Running the App Locally

**Development Mode:**
```bash
npm run dev
```
Starts the Next.js dev server with hot module reloading on [http://localhost:3000](http://localhost:3000).

**Production Build:**
```bash
npm run build
npm start
```
Builds and runs the optimized production version.

**Database Migrations:**
```bash
npm run db:push
```
Pushes schema changes to the database.

### Using ngrok for Webhooks (Local Development)

To test webhook endpoints locally with external services, use ngrok:

```bash
npm run dev:ngrok
```

This tunnels your local server to a public URL for webhook testing.

### Typical User Workflow

1. **Sign Up**: Create an account using GitHub, Google, or email
2. **Create Agent**: Navigate to Agents tab, create new AI agent with custom instructions
3. **Schedule Meeting**: Go to Meetings tab, create new meeting and select an agent
4. **Start Meeting**: Join the video call when meeting time arrives
5. **Review Recording**: Access meeting recordings, transcripts, and AI summaries from dashboard

## API Reference

SynapSe uses **tRPC** for type-safe API communication. Core routers:

### Agents Router (`/trpc/routers`)

**Create Agent:**
```typescript
agents.create.mutate({
  name: "Customer Support Bot",
  instructions: "You are a helpful customer support specialist..."
})
```

**Get Agents:**
```typescript
agents.getMany.useQuery({
  page: 1,
  pageSize: 10,
  search: "support"
})
```

**Update Agent:**
```typescript
agents.update.mutate({
  id: "agent-id",
  name: "Updated Name",
  instructions: "Updated instructions..."
})
```

**Delete Agent:**
```typescript
agents.delete.mutate({ id: "agent-id" })
```

### Meetings Router (`/trpc/routers`)

**Create Meeting:**
```typescript
meetings.create.mutate({
  name: "Customer Sprint Review",
  agentId: "agent-id"
})
```

**Get Meetings:**
```typescript
meetings.getMany.useQuery({
  page: 1,
  pageSize: 10,
  search: "review",
  status: "completed"
})
```

**Get Transcript:**
```typescript
meetings.getTranscript.useQuery({ id: "meeting-id" })
```

**Start Meeting:**
```typescript
meetings.startMeeting.mutate({ id: "meeting-id" })
```

**Generate Chat Token:**
```typescript
meetings.generateChatToken.mutate()
```

### Premium Router

**Check Premium Status:**
```typescript
premium.checkPremiumStatus.useQuery()
```

**Create Checkout:**
```typescript
premium.createCheckout.mutate({ productId: "product-id" })
```

## Testing

Currently, the project does not have an automated test suite configured. To set up testing:

```bash
npm install --save-dev vitest @testing-library/react
```

Run linting to check for code quality issues:

```bash
npm run lint
```

## Deployment

### Prerequisites for Deployment

- PostgreSQL database (Neon, AWS RDS, or similar)
- Stream.io account with production API keys
- Google Cloud project with Generative AI API enabled
- GitHub and Google OAuth apps configured for production domain
- Polar account configured for production

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel: [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel project settings
4. Deploy with `git push`

**Vercel Configuration (optional):**
```bash
npm i -g vercel
vercel env pull .env.local
vercel deploy
```

### Docker Deployment

Create a [Dockerfile](Dockerfile) in the root:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t meet-ai:latest .
docker run -p 3000:3000 --env-file .env.prod meet-ai:latest
```

## Project Structure

```
meet-ai/
├── app/                           # Next.js 13+ app directory
│   ├── (auth)/                   # Authentication pages layout
│   │   ├── sign-in/page.tsx      # Sign-in page
│   │   └── sign-up/page.tsx      # Registration page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── agents/               # Agent management
│   │   ├── meetings/             # Meeting management
│   │   ├── upgrade/              # Premium upgrade page
│   │   └── page.tsx              # Dashboard home
│   ├── api/                      # API routes
│   │   ├── auth/                 # Better Auth endpoints
│   │   ├── trpc/                 # tRPC backend
│   │   ├── inngest/              # Background job webhooks
│   │   └── webhook/              # External webhooks
│   ├── call/[meetingId]/         # Video call interface
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                    # React components
│   ├── ui/                       # Radix UI component wrappers
│   ├── command-select.tsx        # Custom command select
│   ├── data-pagination.tsx       # Pagination component
│   ├── empty-state.tsx           # Empty states
│   └── ...                       # Other shared components
│
├── db/                           # Database
│   ├── schema.ts                 # Drizzle ORM schema
│   └── index.ts                  # Database client
│
├── inngest/                      # Background jobs
│   ├── client.ts                 # Inngest client
│   └── functions.ts              # Job definitions
│
├── lib/                          # Utilities
│   ├── auth.ts                   # Auth configuration
│   ├── stream-video.ts           # Stream.io video SDK
│   ├── stream-chat.ts            # Stream.io chat SDK
│   ├── avatar.tsx                # Avatar generation
│   └── utils.ts                  # General utilities
│
├── modules/                      # Feature modules
│   ├── agents/                   # Agent management module
│   ├── meetings/                 # Meetings module
│   ├── auth/                     # Auth UI components
│   ├── dashboard/                # Dashboard components
│   ├── premium/                  # Premium features
│   └── ...                       # Other feature modules
│
├── trpc/                         # tRPC setup
│   ├── client.tsx                # tRPC client instance
│   ├── server.tsx                # tRPC server provider
│   ├── init.ts                   # tRPC router creation
│   ├── query-client.ts           # React Query setup
│   └── routers/                  # Route definitions
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Mobile detection hook
│
├── public/                       # Static assets
├── drizzle.config.ts             # Drizzle ORM config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── next.config.ts                # Next.js config
├── eslint.config.mjs             # ESLint config
└── package.json                  # Dependencies
```

## Contributing

We welcome contributions! Follow these steps:

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/yourusername/meet-ai.git
   cd meet-ai
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** with a clear description of changes
7. **Ensure** code passes linting and builds successfully:
   ```bash
   npm run lint
   npm run build
   ```

### Code Style

- Follow TypeScript best practices
- Use ESLint rules defined in [eslint.config.mjs](eslint.config.mjs)
- Format code with Prettier (auto-configured)
- Components should use Radix UI primitives with Tailwind CSS

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this software for personal or commercial purposes.

---

**Built with ❤️ using Next.js, React, and TypeScript**

For questions or issues, please open a GitHub issue or contact the maintainers.
