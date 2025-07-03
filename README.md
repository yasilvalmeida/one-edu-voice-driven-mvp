# ONE EDU Voice-Driven MVP

A minimal educational platform designed for children and parents. The platform provides personalized learning experiences through AI-powered text conversations with Astra, an AI mentor, and gamified progress tracking.

## 🎯 Vision

ONE EDU transforms education by making learning conversational, personalized, and engaging through AI interactions. Children can learn life skills through conversations with Astra (AI mentor) while tracking their progress through an XP-based dashboard.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Supabase (Auth + Database)
- **AI**: OpenAI GPT-4o (Text Chat)
- **Deployment**: Vercel

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd one-edu-voice-driven-mvp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy the environment template
   cp .env.example .env.local

   # Verify your setup (optional)
   npm run verify-env
   ```

   Then edit `.env.local` with your actual credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **Database Setup**

   - Create a Supabase project
   - Run the migration: `supabase/migrations/0001_profiles.sql`
   - Enable Row Level Security

5. **Run Development Server**

   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 📋 Module Specifications

### ✅ **Module 1: Authentication & Role Management** (IMPLEMENTED)

**Objective**: Implement secure authentication with role-based access control.

**Features**:

- ✅ Email/password authentication via Supabase Auth
- ✅ Role selection: Child or Parent
- ✅ Child onboarding form (name, age, interests)
- ✅ Role-based routing and access control
- ✅ Profile management with RLS policies

**Routes**:

- `/auth` - Authentication (signup/login)
- `/role` - Role selection interface
- `/parent` - Parent dashboard
- `/child/onboarding` - Child profile setup
- `/child/chat` - Mentor chat with Astra (Module 2)
- `/child/dashboard` - XP and progress dashboard (Module 3)

**Database Schema**:

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null check (role in ('child','parent')),
  name text,
  age int,
  interests text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

---

### ✅ **Module 2: Mentor Chat UI (GPT-4o Text Chat)** (IMPLEMENTED)

**Objective**: Simulate the core of ONE EDU—a daily conversation with Astra (our AI mentor).

**Features**:

- ✅ Interactive chat interface with message bubbles
- ✅ Real-time conversation with Astra via GPT-4o
- ✅ Astra's personality system prompt:
  - "You are Astra, a kind, wise, slightly playful mentor helping a child learn real-world life skills. Always respond with encouragement, open-ended questions, and emotional intelligence."
- ✅ Message history within single session
- ✅ Typing indicators and loading states
- ✅ Astra avatar with sparkle emoji (✨)
- ✅ Auto-scroll to new messages
- ✅ Fallback handling for API errors
- ✅ Toast notifications for setup issues

**Components**:

- ✅ `ChatInterface` - Main chat UI with full functionality
- ✅ `MessageBubble` - Individual message display with timestamps
- ✅ `ChatInput` - Message input with Enter/Shift+Enter support
- ✅ `AstraAvatar` - AI mentor visual representation

**Routes**:

- ✅ `/child/chat` - Main chat interface with Astra

**API Integration**:

- ✅ OpenAI GPT-4o API for chat responses
- ✅ `/api/chat/message` - POST endpoint for sending messages
- ✅ Error handling and fallback responses

---

### ✅ **Module 3: Static XP Dashboard Mock** (IMPLEMENTED)

**Objective**: Build a comprehensive progress dashboard to simulate the child's experience system.

**Features**:

- ✅ Animated XP progress bar (1,250 / 1,500 XP)
- ✅ 3 skill categories with level indicators:
  - Communication (Level 3/5)
  - Problem Solving (Level 2/5)
  - Leadership (Level 1/5)
- ✅ Badge system with 2 unlocked + 2 locked badges
- ✅ Progress tracking with level dots
- ✅ Learning streak counter (5 days)
- ✅ Motivational stats dashboard
- ✅ Responsive design with kid-friendly styling

**Components**:

- ✅ `XPProgressBar` - Animated progress indicator with level tracking
- ✅ `SkillCard` - Individual skill display with colored themes
- ✅ `BadgeDisplay` - Achievement badge showcase with unlock dates
- ✅ `DashboardStats` - Overall progress summary with quick actions

**Routes**:

- ✅ `/child/dashboard` - Main XP and progress dashboard

**Design Notes**:

- ✅ Static implementation with realistic mock data
- ✅ Emoji-based visual elements for appeal
- ✅ TailwindCSS responsive layout
- ✅ Gradient backgrounds and hover effects

## 📊 Current Implementation Status

| Module   | Status      | Progress | Description                  |
| -------- | ----------- | -------- | ---------------------------- |
| Module 1 | ✅ Complete | 100%     | Auth & Role Management       |
| Module 2 | ✅ Complete | 100%     | Mentor Chat UI (GPT-4o Text) |
| Module 3 | ✅ Complete | 100%     | Static XP Dashboard Mock     |

## 🗂️ Project Structure

```
one-edu-voice-driven-mvp/
├── app/                        # Next.js App Router
│   ├── auth/                   # Authentication pages
│   ├── role/                   # Role selection
│   ├── parent/                 # Parent dashboard
│   ├── child/                  # Child learning interface
│   │   ├── onboarding/         # Child profile setup
│   │   ├── chat/               # Mentor chat with Astra
│   │   └── dashboard/          # XP and progress dashboard
│   ├── api/                    # API endpoints
│   │   └── chat/               # Chat API routes
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # Reusable components
│   ├── ui/                     # UI components
│   ├── chat/                   # Chat interface components
│   │   ├── chat-interface.tsx  # Main chat component
│   │   ├── message-bubble.tsx  # Message display
│   │   ├── chat-input.tsx      # Message input
│   │   └── astra-avatar.tsx    # AI mentor avatar
│   ├── dashboard/              # Dashboard components
│   │   ├── dashboard-stats.tsx # Stats overview
│   │   ├── xp-progress-bar.tsx # XP progress display
│   │   ├── skill-card.tsx      # Individual skill cards
│   │   └── badge-display.tsx   # Achievement badges
│   └── toast.tsx               # Toast notification system
├── lib/                        # Utility libraries
│   ├── supabase.ts             # Supabase client
│   ├── auth-context.tsx        # Authentication context
│   └── openai.ts               # OpenAI GPT-4o integration
├── supabase/                   # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── types/                      # TypeScript type definitions
└── docs/                       # Documentation
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration (Supabase Auth)
- `POST /api/auth/login` - User login (Supabase Auth)
- `POST /api/auth/logout` - User logout (Supabase Auth)

### Chat

- ✅ `POST /api/chat/message` - Send message to Astra (GPT-4o)
  - Request: `{ messages: ChatMessage[], childName?: string }`
  - Response: `{ message: string, timestamp: string }`
  - Fallback handling for missing API key

### Dashboard

- Static mock data (no API required)
- XP, skills, and badges served from component state

## 🎨 Design System

### Colors (Kid-Friendly Palette)

- **Primary**: Soft purple (#843dff - #4b05ad)
- **Secondary**: Soft teal (#14b8a6 - #134e4a)
- **Accent**: Playful pink (#d946ef - #701a75)

### Typography

- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale (text-sm to text-4xl)

### Components

- **Cards**: Rounded corners, soft shadows
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs with focus states
- **Chat**: Bubble design with avatar integration
- **Dashboard**: Animated progress bars and skill cards

## 🧪 Testing Strategy

### Unit Testing

- Jest + React Testing Library
- Component testing
- Utility function testing

### Integration Testing

- API endpoint testing
- Database integration testing
- Authentication flow testing

### E2E Testing

- Cypress for user journey testing
- Chat interface testing
- Cross-browser compatibility

## 🚀 Deployment

### Production Environment

- **Hosting**: Vercel
- **Database**: Supabase
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics

### Environment Variables

```env
# 🟢 Client-side (Safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app

# 🔴 Server-side only (Keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
```

⚠️ **Security Note**: Never use `NEXT_PUBLIC_` prefix for secrets!

### Deployment Commands

```bash
# Build and deploy
npm run build
vercel --prod

# Database migrations
supabase db push
```

## 📈 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Chat Response Time**: < 3s
- **Core Web Vitals**: All green

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔐 Security & Best Practices

### Environment Variables Security

- ✅ Use `.env.local` for development (gitignored)
- ✅ Never commit real credentials to version control
- ✅ Use `NEXT_PUBLIC_` only for client-safe variables
- ✅ Keep API keys and secrets server-side only
- ✅ Run `npm run verify-env` to check your setup

### Quick Security Check

```bash
npm run verify-env  # Validates your environment setup
```

For detailed security guidelines, see [SECURITY.md](./SECURITY.md)

## 🛠️ Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run verify-env  # Verify environment variables
npm run setup       # Install dependencies and verify setup
```

## 🔗 Links

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Security Guidelines](./SECURITY.md)

## 🎉 Implementation Complete

All three modules have been successfully implemented:

1. **✅ Authentication & Role Management** - Complete user auth flow
2. **✅ Mentor Chat UI** - GPT-4o powered chat with Astra
3. **✅ Static XP Dashboard** - Gamified progress tracking

The platform is now ready for testing and deployment!
