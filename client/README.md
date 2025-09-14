# Multi-Tenant SaaS Notes App Frontend

A modern, production-ready frontend for a multi-tenant SaaS Notes application built with Next.js, Tailwind CSS, and shadcn/ui components.

## Features

### Authentication & Multi-Tenancy
- JWT-based authentication with tenant slug support
- Role-based access control (Admin/Member roles)
- Secure token management with localStorage persistence
- Protected routes with automatic redirects

### Note Management
- Create, read, update, and delete notes
- Rich text editing interface
- Real-time character counting
- Search and filter functionality
- Responsive note cards with hover interactions

### Plan Management
- Free plan with 3-note limit
- Pro plan with unlimited notes
- Upgrade banners with role-based actions
- Admin-only upgrade capabilities
- Usage tracking and statistics

### Modern UI/UX
- Clean, professional design using shadcn/ui
- Responsive layout for all device sizes
- Smooth animations and micro-interactions
- Dark/light theme support ready
- Consistent 8px spacing system

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── login/             # Authentication page
│   ├── notes/             # Notes management
│   │   ├── new/           # Create new note
│   │   └── [id]/          # View/edit specific note
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Home page with auth redirect
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (Navbar)
│   ├── notes/             # Note-related components
│   └── ui/                # shadcn/ui components + custom
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state management
├── lib/                   # Utility functions
│   ├── api.ts             # API client with JWT handling
│   └── utils.ts           # Common utilities
└── types/                 # TypeScript type definitions
    └── index.ts           # Core types (User, Note, Tenant)
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

For testing purposes, you can use these demo credentials:
- **Workspace**: `demo`
- **Email**: `admin@demo.com`
- **Password**: `password`

## Usage

### Authentication Flow
1. Navigate to `/login`
2. Enter tenant slug, email, and password
3. JWT token is stored securely and used for API calls
4. Automatic redirect to notes dashboard

### Creating Notes
1. Click "New Note" button or navigate to `/notes/new`
2. Enter title and content
3. Save to create the note
4. Automatic redirect to note detail page

### Admin Features
- Access admin dashboard at `/admin`
- View workspace statistics
- Upgrade tenant plans
- Manage workspace settings

### Plan Limitations
- **Free Plan**: 3 notes maximum
- **Pro Plan**: Unlimited notes
- Upgrade banners appear when limits are reached
- Role-based upgrade permissions

## API Integration

The app expects a backend API with the following endpoints:

### Authentication
- `POST /auth/login` - Login with tenant slug, email, password

### Notes
- `GET /notes` - List user's notes
- `GET /notes/:id` - Get specific note
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Tenants
- `GET /tenants/:slug` - Get tenant information
- `POST /tenants/:slug/upgrade` - Upgrade tenant plan

### API Response Formats

```typescript
// Login response
{
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'member';
    tenantSlug: string;
  };
  tenant: {
    slug: string;
    name: string;
    plan: 'free' | 'pro';
    noteCount: number;
    maxNotes: number;
  };
}

// Note object
{
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

## Key Components

### AuthProvider
Manages authentication state, JWT tokens, and provides auth context to the app.

### RequireAuth
Higher-order component that protects routes and handles role-based access.

### UpgradeBanner
Displays plan upgrade prompts when note limits are reached.

### NoteList & NoteItem
Handles note display with search, filtering, and interaction capabilities.

## Styling

The app uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible components
- **Lucide React** for iconography
- **Custom CSS variables** for theming support

## Error Handling

- API errors are caught and displayed to users
- Form validation prevents invalid submissions
- Automatic token refresh and logout handling
- Graceful loading states throughout the app

## Performance Features

- Client-side routing with Next.js App Router
- Optimized bundle splitting
- Lazy loading of components
- Efficient state management
- Responsive images and layouts

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. The app is configured for static export and can be deployed to:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- Any static hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.