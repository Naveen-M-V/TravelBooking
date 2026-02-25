# Halal Travels - Complete Project Structure

## 📁 Full Folder Tree

```
halal-travels/
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   ├── customer/
│   │   │   │   └── page.tsx
│   │   │   ├── vendor/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── flights/
│   │   │   └── page.tsx
│   │   ├── packages/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   └── apiClient.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useUser.ts
│   ├── types/
│   │   └── index.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── middleware.ts
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── almosafer.ts
│   │   │   ├── ccavenue.ts
│   │   │   ├── env.ts
│   │   │   └── supabase.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── flight.controller.ts
│   │   │   ├── package.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── vendor.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── flight.service.ts
│   │   │   ├── package.service.ts
│   │   │   ├── payment.service.ts
│   │   │   └── vendor.service.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── flight.routes.ts
│   │   │   ├── package.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── vendor.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── utils/
│   │   │   └── errors.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🎯 Architecture Overview

### Frontend (Next.js 14)
- **App Router** with server and client components
- **Tailwind CSS** for styling
- **Supabase Auth** integration ready
- **Role-based routing** (Customer, Vendor, Admin)
- **API client** with interceptors
- **Context API** for state management

### Backend (Express + TypeScript)
- **MVC Architecture** with service layer
- **Modular routing** system
- **Middleware** for auth and roles
- **Supabase** database integration
- **CC Avenue** payment gateway placeholder
- **Almosafer API** flight search placeholder
- **Global error handling**

## 🔧 Setup Instructions

### 1. Initial Setup

```bash
cd halal-travels

# Setup Frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup Backend
cd ../backend
npm install
cp .env.example .env
# Edit .env with your credentials
```

### 2. Run Development

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

### 3. Docker Deployment

```bash
# From root directory
docker-compose up --build
```

## 📋 Key Features Structure

### User Roles
- **Customer**: Book flights and packages
- **Vendor**: Create and manage packages
- **Admin**: Full system management

### API Routes
```
/api/auth/*       - Authentication
/api/flights/*    - Flight search & booking
/api/packages/*   - Package management
/api/bookings/*   - Booking management
/api/payments/*   - Payment processing
/api/vendors/*    - Vendor management
```

### Frontend Routes
```
/                      - Landing page
/flights              - Flight search
/packages             - Package listing
/checkout             - Checkout process
/login                - User login
/register             - User registration
/dashboard/customer   - Customer dashboard
/dashboard/vendor     - Vendor dashboard
/dashboard/admin      - Admin dashboard
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
CCAVENUE_MERCHANT_ID=
ALMOSAFER_API_KEY=
```

## 🚀 Next Steps

1. **Configure Supabase**
   - Create tables for users, packages, bookings, payments
   - Set up authentication
   - Configure RLS policies

2. **Implement Authentication**
   - Complete auth service in backend
   - Wire up frontend auth context
   - Add protected route middleware

3. **Add Business Logic**
   - Implement controllers and services
   - Add validation
   - Create database queries

4. **Integrate APIs**
   - CC Avenue payment flow
   - Almosafer flight search
   - Payment webhooks

5. **Testing & Deployment**
   - Add tests
   - Set up CI/CD
   - Deploy to production

## 📦 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payment | CC Avenue |
| Flights | Almosafer API |
| Deployment | Docker, Docker Compose |

## 📝 Notes

- All business logic placeholders are marked with `// TODO:`
- Environment variables are documented but not included
- API integrations are structured but not implemented
- Database schema needs to be created in Supabase
- All routes and controllers are scaffolded

---

**Built with clean architecture principles for easy scaling and maintenance.**
