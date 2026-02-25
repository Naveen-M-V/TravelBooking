# 🔐 Security & Architecture - Almosafer Integration

## ✅ Correct Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                            │
│  - NEVER has Almosafer credentials                               │
│  - Only knows YOUR backend URL                                   │
│  - Environment: NEXT_PUBLIC_API_URL=http://localhost:5000/api   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP Request
                             │ (NO Almosafer credentials)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                             │
│  - HAS Almosafer credentials in .env                             │
│  - Handles OAuth2 authentication                                 │
│  - Calls Almosafer APIs with credentials                         │
│  - Environment variables:                                        │
│    • ALMOSAFER_API_URL=https://apiv2.almosafer.com              │
│    • ALMOSAFER_CLIENT_ID                                         │
│    • ALMOSAFER_CLIENT_SECRET                                     │
│    • ALMOSAFER_API_KEY                                           │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ OAuth2 + API calls
                             │ (WITH credentials)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                 ALMOSAFER API                                    │
│  - https://apiv2.almosafer.com                                   │
│  - /auth/api/v1.0/oauth2/token                                   │
│  - /flights/api/v1.0/*                                           │
│  - /hotels/api/v1.0/*                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Environment Variables

### Backend `.env` (REQUIRED - Has Almosafer credentials)

```env
# Server
PORT=5000
NODE_ENV=development

# Almosafer API Configuration (⚠️ NEVER put in frontend!)
ALMOSAFER_API_URL=https://apiv2.almosafer.com
ALMOSAFER_CLIENT_ID=your_client_id_here
ALMOSAFER_CLIENT_SECRET=your_client_secret_here
ALMOSAFER_API_KEY=your_api_key_here

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your_jwt_secret

# CORS
ALLOWED_ORIGINS=http://localhost:3001
```

### Frontend `.env.local` (NO Almosafer credentials!)

```env
# Backend API (your Express server)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase (frontend auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Environment
NEXT_PUBLIC_ENV=development
```

**⚠️ CRITICAL: Frontend NEVER has these:**
- ❌ ALMOSAFER_CLIENT_ID
- ❌ ALMOSAFER_CLIENT_SECRET
- ❌ ALMOSAFER_API_KEY
- ❌ ALMOSAFER_API_URL

---

## 🔒 How Authentication Works

### 1. Backend OAuth2 Flow (Automatic)

```typescript
// backend/src/services/flight.service.ts
private static async getAccessToken(): Promise<string> {
  // Uses credentials from .env (backend only)
  const response = await almosaferClient.post('/auth/api/v1.0/oauth2/token', 
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: almosaferConfig.clientId,        // From .env
      client_secret: almosaferConfig.clientSecret // From .env
    })
  )
  
  const { access_token, expires_in } = response.data
  
  // Cache token in memory (backend only)
  this.tokenCache = {
    token: access_token,
    expiresAt: Date.now() + (expires_in - 60) * 1000
  }
  
  return access_token
}
```

**Security Features:**
- ✅ Credentials stored in backend `.env` only
- ✅ Token cached in backend memory (not exposed)
- ✅ Auto-refresh 1 minute before expiry
- ✅ Never sent to frontend

### 2. Frontend Calls Backend (NOT Almosafer)

```typescript
// Frontend - calls YOUR backend
async function searchFlights(params) {
  const response = await fetch('http://localhost:5000/api/flights/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // NO Almosafer credentials here!
    },
    body: JSON.stringify(params)
  })
  
  return response.json()
}
```

**What Frontend NEVER does:**
- ❌ `fetch('https://apiv2.almosafer.com/...')` - NEVER!
- ❌ Store Almosafer API keys
- ❌ Handle OAuth2 tokens
- ❌ Know Almosafer exists

---

## 🎯 Complete Request Flow Example

### Flight Search Flow

```
1. USER clicks "Search Flights" in browser
   ↓
2. FRONTEND calls YOUR backend:
   POST http://localhost:5000/api/flights/search
   Headers: { "Content-Type": "application/json" }
   Body: { "origin": "JED", "destination": "RUH", ... }
   
   ↓
3. BACKEND receives request:
   FlightController.asyncSearch(req, res)
   ↓
4. BACKEND gets OAuth2 token:
   FlightService.getAccessToken()
   - Reads ALMOSAFER_CLIENT_ID from .env
   - Reads ALMOSAFER_CLIENT_SECRET from .env
   - Calls: POST https://apiv2.almosafer.com/auth/api/v1.0/oauth2/token
   - Gets token, caches it
   
   ↓
5. BACKEND calls Almosafer:
   POST https://apiv2.almosafer.com/flights/api/v1.0/search
   Headers: { 
     "Authorization": "Bearer <token_from_step_4>",
     "X-API-Key": "<from .env>"
   }
   Body: { "origin": "JED", ... }
   
   ↓
6. ALMOSAFER responds:
   { "sId": "abc123", "status": "IN_PROGRESS" }
   
   ↓
7. BACKEND stores in database:
   await prisma.flightSearch.create({ sId: "abc123", ... })
   
   ↓
8. BACKEND responds to frontend:
   { "success": true, "data": { "sId": "abc123" } }
   
   ↓
9. FRONTEND receives response:
   Shows loading spinner, polls for results
```

---

## 🚫 What Frontend NEVER Does

```typescript
// ❌ WRONG - Never do this in frontend!
const response = await fetch('https://apiv2.almosafer.com/flights/api/v1.0/search', {
  headers: {
    'Authorization': `Bearer ${almosaferToken}`,  // ❌ Frontend doesn't have this
    'X-API-Key': 'almosafer_key'                   // ❌ Security risk!
  }
})

// ❌ WRONG - Never store credentials in frontend
const apiKey = process.env.NEXT_PUBLIC_ALMOSAFER_API_KEY  // ❌ NEVER!
const clientSecret = 'secret123'                           // ❌ EXPOSED!
```

**Why this is dangerous:**
- 🔓 API keys visible in browser DevTools
- 🔓 Anyone can steal credentials from frontend code
- 🔓 Attackers can make unlimited API calls
- 🔓 Your Almosafer account gets hacked
- 💸 Fraudulent bookings charged to you

---

## ✅ What Frontend DOES Do

```typescript
// ✅ CORRECT - Call YOUR backend
const response = await fetch('http://localhost:5000/api/flights/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Optional: Your app's JWT for user authentication
    'Authorization': `Bearer ${userJwtToken}`  // Your token, not Almosafer's
  },
  body: JSON.stringify({
    origin: 'JED',
    destination: 'RUH',
    departureDate: '2024-12-25',
    adults: 2,
    cabinClass: 'ECONOMY'
  })
})

const data = await response.json()
// { "success": true, "data": { "sId": "abc123" } }
```

**Why this is secure:**
- ✅ Credentials stay on backend server
- ✅ Only your backend can call Almosafer
- ✅ Frontend can't see Almosafer tokens
- ✅ Rate limiting can be enforced on backend
- ✅ You control who can book flights

---

## 📊 Environment Variables Summary

| Variable | Backend | Frontend | Purpose |
|----------|---------|----------|---------|
| `ALMOSAFER_API_URL` | ✅ Required | ❌ Never | Almosafer API base URL |
| `ALMOSAFER_CLIENT_ID` | ✅ Required | ❌ Never | OAuth2 client ID |
| `ALMOSAFER_CLIENT_SECRET` | ✅ Required | ❌ Never | OAuth2 client secret |
| `ALMOSAFER_API_KEY` | ✅ Required | ❌ Never | API authentication key |
| `NEXT_PUBLIC_API_URL` | ❌ Not needed | ✅ Required | YOUR backend URL |
| `JWT_SECRET` | ✅ Required | ❌ Never | Sign JWT tokens |
| `DATABASE_URL` | ✅ Required | ❌ Never | PostgreSQL connection |

**Rule of thumb:**
- Backend: Has ALL secrets
- Frontend: Only has `NEXT_PUBLIC_*` variables (YOUR backend URL)

---

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your Almosafer credentials
nano .env
```

**Required values:**
```env
ALMOSAFER_API_URL=https://apiv2.almosafer.com
ALMOSAFER_CLIENT_ID=your_actual_client_id
ALMOSAFER_CLIENT_SECRET=your_actual_client_secret
ALMOSAFER_API_KEY=your_actual_api_key
```

### 2. Frontend Setup

```bash
cd frontend

# Create .env.local file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

**Required values:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**⚠️ DO NOT add Almosafer credentials here!**

### 3. Test Backend Auth

```bash
cd backend
npm run dev

# Test OAuth2 (happens automatically)
curl -X POST http://localhost:5000/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "originDestinations": [{"origin": "JED", "destination": "RUH", "departureDate": "2024-12-25"}],
    "adults": 2,
    "cabinClass": "ECONOMY"
  }'

# If successful, you'll see:
# { "success": true, "data": { "sId": "..." } }

# If auth fails, check backend logs:
# [Almosafer Auth] Failed: { error: "invalid_client" }
# → Check your ALMOSAFER_CLIENT_ID and CLIENT_SECRET
```

### 4. Test Frontend Integration

```bash
cd frontend
npm run dev

# Open browser: http://localhost:3001
# Open DevTools → Network tab
# Search for flights
# Verify requests go to: http://localhost:5000/api/flights/*
# Verify NO requests to: apiv2.almosafer.com
```

---

## 🛡️ Security Checklist

- ✅ Almosafer credentials in backend `.env` only
- ✅ Backend `.env` added to `.gitignore`
- ✅ Frontend NEVER imports backend config files
- ✅ OAuth2 tokens cached in backend memory (not cookies)
- ✅ Frontend only knows YOUR backend URL
- ✅ Rate limiting on backend routes
- ✅ JWT authentication for booking endpoints
- ✅ CORS configured to allow only your frontend domain
- ✅ HTTPS in production
- ✅ Environment variables validated on startup

---

## ❓ FAQ

**Q: Can I call Almosafer directly from frontend for speed?**
A: ❌ No! This exposes your credentials. Always go through your backend.

**Q: Where is the OAuth2 token stored?**
A: ✅ In backend memory (`tokenCache` variable). Not in cookies, localStorage, or database.

**Q: Does frontend need ALMOSAFER_API_URL?**
A: ❌ No! Frontend only needs YOUR backend URL (`NEXT_PUBLIC_API_URL`).

**Q: How does authentication happen?**
A: ✅ Automatically. Backend gets OAuth2 token before each Almosafer API call. Token is cached and auto-refreshed.

**Q: What if token expires?**
A: ✅ Backend automatically refreshes 1 minute before expiry. Frontend never needs to know.

**Q: Can I see Almosafer responses in browser DevTools?**
A: ❌ No. Frontend only sees YOUR backend's responses. Almosafer responses stay on backend.

---

## ✅ Summary

**Backend (.env):**
```env
ALMOSAFER_API_URL=https://apiv2.almosafer.com
ALMOSAFER_CLIENT_ID=your_id
ALMOSAFER_CLIENT_SECRET=your_secret
ALMOSAFER_API_KEY=your_key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Architecture:**
```
Frontend → YOUR Backend → Almosafer API
(no creds)  (has creds)   (gets requests)
```

**Security:**
- ✅ All Almosafer credentials in backend only
- ✅ OAuth2 handled automatically by backend
- ✅ Frontend never sees Almosafer
- ✅ Tokens cached and auto-refreshed

**Ready to use! 🚀**
