# ONE EDU - AI-Powered Educational Platform

A production-ready educational platform that delivers personalized learning experiences through AI-powered conversations and gamified progress tracking. Built for children and parents, featuring an intelligent AI mentor named Astra that guides students through life skills development.

---

## 1. Project Overview

### The Problem

Traditional education struggles with:
- One-size-fits-all approaches that ignore individual learning styles
- Limited teacher availability for personalized guidance
- Lack of engaging, interactive learning experiences for digital-native children
- Difficulty tracking soft skills development (communication, leadership, problem-solving)
- Parent disconnect from children's educational progress

### The Solution

ONE EDU transforms education by making learning conversational, personalized, and engaging. Children interact with Astra, an AI mentor powered by GPT-4o, who adapts to each child's interests, age, and learning pace. The gamified XP system and skill tracking make progress visible and motivating.

### Why It Matters

- **Personalized at scale**: Every child gets individualized attention without requiring additional teachers
- **Soft skills focus**: Develops communication, problem-solving, and leadership—skills often overlooked
- **Parent visibility**: Parents can monitor progress and understand their child's development
- **Engagement through gamification**: XP, badges, and streaks keep children motivated
- **Accessible 24/7**: Learning happens whenever the child is ready

---

## 2. Real-World Use Cases

| Sector | Application |
|--------|-------------|
| **K-12 Education** | Supplementary learning platform for schools and homeschoolers |
| **EdTech Startups** | Foundation for personalized learning applications |
| **After-School Programs** | Structured skill development outside classroom hours |
| **Corporate Training** | Adaptable for employee soft skills development |
| **Parenting Apps** | Educational component for family-focused applications |
| **Special Education** | Adaptive learning for children with different needs |

---

## 3. Core Features

| Feature | Business Value |
|---------|----------------|
| **AI Mentor (Astra)** | GPT-4o powered conversations that adapt to each child's level and interests |
| **Role-Based Access** | Separate experiences for children and parents with appropriate content |
| **Skill Tracking** | Visual progress on Communication, Problem Solving, and Leadership skills |
| **XP & Gamification** | Point system with levels, badges, and learning streaks for engagement |
| **Child-Safe Design** | Age-appropriate content with parental oversight |
| **Secure Authentication** | Supabase-powered auth with email verification |
| **Real-Time Sync** | Instant updates across devices using Supabase real-time |

---

## 4. High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │     │    Supabase     │     │    OpenAI       │
│   (Frontend)    │────▶│   (Backend)     │     │   (GPT-4o)      │
│                 │     │                 │     │                 │
│ • App Router    │     │ • Auth          │     │ • Chat API      │
│ • React 18      │     │ • PostgreSQL    │     │ • Context       │
│ • TailwindCSS   │     │ • Row Security  │     │   Management    │
│ • Chat UI       │     │ • Real-time     │     │ • Personality   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Vercel Deployment     │
                    │   • Edge Functions      │
                    │   • CDN Distribution    │
                    │   • SSL/Security        │
                    └─────────────────────────┘
```

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, routing |
| **UI Framework** | React 18, TypeScript | Component architecture |
| **Styling** | TailwindCSS | Responsive, kid-friendly design |
| **Authentication** | Supabase Auth | Secure user management with RLS |
| **Database** | Supabase (PostgreSQL) | Relational data with real-time sync |
| **AI Engine** | OpenAI GPT-4o | Conversational AI for mentoring |
| **Deployment** | Vercel | Serverless deployment with edge functions |

---

## 6. How the System Works

### User Journey Flow

```
Registration → Role Selection → Profile Setup → Learning → Progress Tracking
```

1. **Authentication**: User signs up with email/password via Supabase
2. **Role Selection**: Choose between Child or Parent role
3. **Child Onboarding**: Children provide name, age, and interests for personalization
4. **AI Mentoring**: Chat with Astra for personalized learning conversations
5. **Progress Tracking**: XP accumulates, skills level up, badges unlock

### Chat Processing Pipeline

```
User Message
    ↓
API Route (/api/chat/message)
    ↓
Context Assembly (child profile + conversation history)
    ↓
GPT-4o Processing (with Astra's personality prompt)
    ↓
Response Generation
    ↓
UI Update (with typing indicators)
```

### Astra's Personality

Astra is designed as:
> "A kind, wise, slightly playful mentor helping a child learn real-world life skills. Always responds with encouragement, open-ended questions, and emotional intelligence."

---

## 7. Setup & Run

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- OpenAI API key

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/one-edu-voice-driven-mvp.git
cd one-edu-voice-driven-mvp

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Edit .env.local with your credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# OPENAI_API_KEY=sk-your-openai-api-key

# Setup database (run migration in Supabase)
# Execute: supabase/migrations/0001_profiles.sql

# Start development server
npm run dev
```

### Environment Variables

```env
# Client-side (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app

# Server-side only (keep secret)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-api-key
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Application** | http://localhost:3000 | Main application |
| **Auth** | /auth | Login/signup flow |
| **Child Chat** | /child/chat | AI mentor conversation |
| **Dashboard** | /child/dashboard | XP and progress tracking |
| **Parent View** | /parent | Parent dashboard |

---

## 8. API Reference

### Authentication (Supabase)

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/signup` | User registration |
| `POST /api/auth/login` | User login |
| `POST /api/auth/logout` | User logout |

### Chat API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/message` | Send message to Astra |

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about teamwork" }
  ],
  "childName": "Alex"
}
```

**Response:**
```json
{
  "message": "Great question, Alex! Teamwork is like...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 9. Scalability & Production Readiness

### Current Architecture Strengths

| Aspect | Implementation |
|--------|----------------|
| **Serverless** | Vercel Edge Functions scale automatically |
| **Database** | Supabase PostgreSQL with connection pooling |
| **CDN** | Vercel Edge Network for global distribution |
| **Security** | Row Level Security for data isolation |
| **Real-time** | Supabase subscriptions for live updates |

### Production Enhancements (Recommended)

| Enhancement | Purpose |
|-------------|---------|
| **Analytics** | Vercel Analytics for user behavior insights |
| **Monitoring** | Error tracking with Sentry integration |
| **Caching** | Redis for conversation history caching |
| **Rate Limiting** | Protect API endpoints from abuse |
| **Content Moderation** | AI-powered content filtering for child safety |
| **Offline Support** | PWA capabilities for intermittent connectivity |

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Chat Response Time**: < 3s
- **Core Web Vitals**: All green

---

## 10. Screenshots & Demo

### Application Screens

- [ ] Login/Registration page
- [ ] Role selection interface
- [ ] Child onboarding form
- [ ] Chat interface with Astra
- [ ] XP Dashboard with skill cards
- [ ] Badge achievement display
- [ ] Parent dashboard view

---

## Project Structure

```
one-edu-voice-driven-mvp/
├── app/                        # Next.js App Router
│   ├── auth/                   # Authentication pages
│   ├── role/                   # Role selection
│   ├── parent/                 # Parent dashboard
│   ├── child/                  # Child learning interface
│   │   ├── onboarding/         # Profile setup
│   │   ├── chat/               # Mentor chat
│   │   └── dashboard/          # XP tracking
│   └── api/                    # API endpoints
├── components/                 # Reusable components
│   ├── ui/                     # Base UI components
│   ├── chat/                   # Chat interface
│   └── dashboard/              # Dashboard widgets
├── lib/                        # Utilities
│   ├── supabase.ts             # Database client
│   ├── auth-context.tsx        # Auth state
│   └── openai.ts               # AI integration
├── supabase/                   # Database migrations
└── types/                      # TypeScript definitions
```

---

## Database Schema

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null check (role in ('child','parent')),
  name text,
  age int,
  interests text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

## Design System

### Colors (Kid-Friendly Palette)

- **Primary**: Soft purple (#843dff - #4b05ad)
- **Secondary**: Soft teal (#14b8a6 - #134e4a)
- **Accent**: Playful pink (#d946ef - #701a75)

### Typography

- **Font**: Inter (Google Fonts)
- **Hierarchy**: Responsive scale (text-sm to text-4xl)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Empowering children to learn life skills through AI-powered conversations.*
