# SaaSNotes

A modern, multi-tenant SaaS application for note-taking with role-based access control and subscription management.

## Overview

SaaSNotes is a full-stack web application that provides a secure, scalable platform for organizations to manage their notes and documentation. Built with modern technologies, it offers a clean user interface and robust backend architecture.

## Features

- **Multi-tenant Architecture**: Isolated data and user management per organization
- **Role-based Access Control**: Admin and user roles with different permissions
- **Subscription Management**: Free and Pro plans with different note limits
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Database Management**: PostgreSQL with Prisma ORM for type-safe database operations
- **RESTful API**: Well-structured backend API with proper error handling

## Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Project Structure

```
SaaSNotes/
├── client/                 # Next.js frontend application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable React components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API client
│   └── types/             # TypeScript type definitions
├── server/                # Express.js backend application
│   ├── src/
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route handlers
│   │   └── scripts/       # Database seeding scripts
│   └── prisma/            # Database schema and migrations
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jsndz/SaaSNotes
   cd SaaSNotes

   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="your-jwt-secret-key"
   PORT=3001
   ```

4. **Set up the database**
   ```bash
   cd server
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Notes
- `GET /api/notes` - Get all notes for tenant
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tenants
- `GET /api/tenants` - Get tenant information
- `PUT /api/tenants` - Update tenant settings

## Database Schema

The application uses a multi-tenant architecture with the following main entities:

- **Users**: User accounts with email, password, and role
- **Tenants**: Organizations with subscription plans and note limits
- **Notes**: Individual notes belonging to tenants
- **UserTenants**: Junction table for user-tenant relationships

## Development

### Available Scripts

**Frontend (client/):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Backend (server/):**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

### Database Management

The application uses Prisma for database management. Key commands:

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset the database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
