# Multi-Tenant SaaS Notes Application Backend

A secure, scalable backend for a multi-tenant SaaS notes application built with Node.js, Express, Prisma, and PostgreSQL.

## Architecture Overview

### Multi-Tenancy Approach: Shared Schema with Tenant ID

This application implements **shared schema multi-tenancy**, where:
- All tenants share the same database and schema
- Each table includes a `tenantId` column for data isolation
- Application-level tenant isolation ensures data security
- JWT tokens contain tenant information for automatic scoping

**Why this approach?**
- Cost-effective: Single database for all tenants
- Easy maintenance: One schema to manage
- Efficient resource utilization
- Simplified backup and monitoring
- Good for SaaS applications with many small-to-medium tenants

### Security Model

- **Authentication**: JWT-based with secure token validation
- **Authorization**: Role-based access control (Admin/Member)
- **Tenant Isolation**: All queries automatically filtered by `tenantId`
- **Data Protection**: Cross-tenant access is impossible by design

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Setup Database
```bash
# Create PostgreSQL database
createdb multi_tenant_notes

# Update .env with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/multi_tenant_notes"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database Schema
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with test data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Test Accounts

All test accounts use password: `password`

| Email | Password | Role | Tenant |
|-------|----------|------|---------|
| admin@acme.test | password | Admin | Acme |
| user@acme.test | password | Member | Acme |
| admin@globex.test | password | Admin | Globex |
| user@globex.test | password | Member | Globex |
## API Endpoints

### Authentication
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "admin@acme.test",
  "password": "password"
}
```

### Health Check
```http
GET /health
```

### Notes Management (Authenticated)
```http
# Create note
POST /notes
Authorization: Bearer <jwt-token>

# List notes
GET /notes
Authorization: Bearer <jwt-token>

# Get specific note
GET /notes/:id
Authorization: Bearer <jwt-token>

# Update note
PUT /notes/:id
Authorization: Bearer <jwt-token>

# Delete note
DELETE /notes/:id
Authorization: Bearer <jwt-token>
```

### Tenant Management (Admin Only)
```http
# Upgrade subscription
POST /tenants/:slug/upgrade
Authorization: Bearer <admin-jwt-token>
```

## Multi-Tenant Features

### Subscription Plans

**Free Plan:**
- Maximum 3 notes per tenant
- All basic functionality

**Pro Plan:**
- Unlimited notes
- All features unlocked

### Tenant Isolation

- All database queries automatically filtered by `tenantId`
- JWT tokens contain tenant information
- Cross-tenant data access is impossible
- Admin operations are tenant-scoped

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and Member roles with different permissions
- **Tenant Isolation**: Complete data separation between tenants
- **Rate Limiting**: Protection against API abuse
- **Helmet Security**: Security headers and protection
- **Password Hashing**: bcrypt for secure password storage

## Database Schema

### Core Tables

**tenants**
- `id`: Unique identifier
- `name`: Tenant display name
- `slug`: URL-friendly identifier
- `subscription`: Plan type (free/pro)

**users**
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `role`: User role (admin/member)
- `tenantId`: Foreign key to tenants

**notes**
- `id`: Unique identifier
- `title`: Note title
- `content`: Note content
- `userId`: Foreign key to users
- `tenantId`: Foreign key to tenants (isolation)

## Development Workflow

### Database Changes
```bash
# Create new migration
npx prisma migrate dev --name "description_of_change"

# Reset database (development only)
npx prisma migrate reset

# View database
npm run db:studio
```

### Environment Variables
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

## Testing the API

### 1. Login and Get Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@acme.test", "password": "password"}'
```

### 2. Create a Note
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "My First Note", "content": "This is a test note"}'
```

### 3. List Notes
```bash
curl -X GET http://localhost:3000/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Upgrade Subscription (Admin only)
```bash
curl -X POST http://localhost:3000/tenants/acme/upgrade \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Scalability Considerations

- **Database Indexing**: Proper indexes on `tenantId` columns
- **Connection Pooling**: Prisma handles connection pooling
- **Horizontal Scaling**: Stateless design allows multiple instances
- **Caching**: Can add Redis for session/data caching
- **Load Balancing**: Ready for load balancer deployment

## Production Checklist

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use environment variables for all configuration
- [ ] Enable HTTPS/SSL
- [ ] Set up proper logging and monitoring
- [ ] Configure database connection pooling
- [ ] Implement proper backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting appropriately
- [ ] Enable database query logging for debugging

## Built With

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing