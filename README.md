# Halal Travels - Travel Booking Application

A production-ready full-stack travel booking platform with role-based access control.

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase Auth**

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **Supabase** (PostgreSQL)

### Integrations
- **CC Avenue** (Payment Gateway)
- **Almosafer Flight API** (Flight Search)

## Project Structure

```
halal-travels/
├── frontend/          # Next.js frontend application
├── backend/           # Express backend API
├── docker-compose.yml # Docker orchestration
└── README.md          # This file
```

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Supabase account
- CC Avenue merchant account (for payment integration)
- Almosafer API credentials (for flight search)

## Quick Start

### Local Development

#### 1. Setup Environment Variables

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your credentials
```

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

#### 3. Run Development Servers

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## User Roles

- **Customer** - Book flights and packages
- **Vendor** - Manage packages and inventory
- **Admin** - Full system access and management

## API Endpoints

Base URL: `http://localhost:5000/api`

- `/auth/*` - Authentication endpoints
- `/flights/*` - Flight search and booking
- `/packages/*` - Package management
- `/bookings/*` - Booking management
- `/payments/*` - Payment processing
- `/vendors/*` - Vendor management

## Frontend Routes

- `/` - Landing page
- `/flights` - Flight search
- `/packages` - Package listing
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/dashboard/customer` - Customer dashboard
- `/dashboard/vendor` - Vendor dashboard
- `/dashboard/admin` - Admin dashboard

## Development Notes

- Frontend uses Next.js App Router with server and client components
- Backend follows MVC architecture with service layer
- Role-based middleware protects routes
- Supabase handles authentication and database
- All API integrations are placeholder-ready

## License

MIT
