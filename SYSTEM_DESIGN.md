# Halal Travels - System Design & Architecture

## Pricing Logic Overview

### Flights
- **Base Price:** From Almosafer API (real-time)
- **Markup:** Global percentage set by admin in Flight Markup settings
- **Formula:** `Final Flight Price = Almosafer Price + (Almosafer Price × Admin Markup %)`
- **Example:** Almosafer price SAR 1000, Admin markup 15% → Final price SAR 1150

### Packages
- **Base Price:** Completely set by admin (no external API)
- **Supplier:** Each package links to ONE supplier/vendor
- **Quote Flow:**
  1. Customer enquires about package
  2. Admin's system auto-sends enquiry to supplier (no customer personal info)
  3. Supplier replies with their cost
  4. Admin quotes final price to customer (supplier cost + admin margin)
  5. Customer sees only admin's quoted price, never supplier details

---

## Admin Dashboard Modules

### 1. Suppliers Management (`/dashboard/admin/suppliers`)
- **CRUD:** Add, edit, deactivate suppliers
- **Fields:** Name, Email, Phone, Contact Person, Website, Notes
- **Usage:** Link to packages, send enquiries

### 2. Packages Management (`/dashboard/admin/packages`)
- **When Creating/Editing Package:**
  - Set name, destination, country, duration, price (final admin price)
  - **NEW:** Select supplier from dropdown
  - Upload images, features, itinerary, highlights
- **Supplier Privacy:** Admin sees supplier, customers DO NOT

### 3. Flight Markup Settings (`/dashboard/admin/flight-markup`)
- **Single Global Setting:**
  - Markup percentage (e.g., 10, 15, 20%)
  - Only one active at a time
- **Applied To:** All flights via Almosafer API
- **Automatic:** Frontend calculates marked-up price when displaying flights

### 4. Package Enquiries Management (`/dashboard/admin/enquiries`)
- **When Customer Enquires:**
  - Auto-email sent to supplier (if package has supplier)
  - Admin sees enquiry status: PENDING → QUOTED → ACCEPTED → BOOKED
  - For suppliers without assigned suppliers: Admin manually handles
- **Admin Action:** Click "Quote Customer" → Set base price + markup % → System calculates total
- **Optional:** "Send to Supplier" button (for manual re-sends)

---

## Data Isolation (Privacy)

### What Customers SEE in `/dashboard/customer/enquiries`
```json
{
  "packageName": "Dubai Deluxe 7 Days",
  "packageDestination": "Dubai",
  "travelDate": "2026-04-15",
  "adults": 2,
  "basePrice": 5000,
  "markupPercentage": 20,
  "totalPrice": 6000,
  "status": "QUOTED"
}
```
**NO:** supplier name, supplier email, supplier phone

### What Admins SEE in `/dashboard/admin/enquiries`
```json
{
  "packageName": "Dubai Deluxe 7 Days",
  "packageDestination": "Dubai",
  "customerName": "Ahmed Ali",
  "customerEmail": "ahmed@email.com",
  "customerPhone": "+966...",
  "supplier": {
    "name": "UAE Tours Ltd",
    "email": "tours@uae.com"
  },
  "travelDate": "2026-04-15",
  "adults": 2,
  "status": "PENDING"
}
```

### What Suppliers RECEIVE in Email
```
Subject: Package Inquiry: Dubai Deluxe 7 Days

Dear UAE Tours Ltd,

Destination: Dubai
Travel Date: 2026-04-15
Travelers: 2 Adults
Inquiry Reference: ABC12345

Please provide your quotation.

[NO customer name, email, or phone]
```

---

## API Endpoints Summary

### Suppliers
- `GET /api/suppliers` — List all (admin only)
- `POST /api/suppliers` — Create (admin only)
- `PUT /api/suppliers/:id` — Update (admin only)
- `DELETE /api/suppliers/:id` — Delete (admin only)

### Packages
- `GET /api/packages` — List all (public, includes supplier ID & name only)
- `POST /api/packages` — Create with supplierId (admin only)
- `PUT /api/packages/:id` — Update with supplierId (admin only)

### Enquiries
- `POST /api/enquiries` — Submit enquiry (auto-sends to supplier)
- `GET /api/enquiries` — List all (admin only)
- `POST /api/enquiries/:id/quote` — Admin quotes customer
- `POST /api/enquiries/:id/send-to-supplier` — Manual re-send to supplier (admin only)

### Flight Markup
- `GET /api/flight-markup` — Get active markup
- `POST /api/flight-markup` — Create new markup (admin only)
- `PUT /api/flight-markup/:id` — Update (admin only)

---

## Frontend Components TODO

1. **Suppliers Page** (`/dashboard/admin/suppliers`)
   - Table: Name, Email, Phone, Actions (Edit, Deactivate, Delete)
   - Add Supplier Modal with form

2. **Update Packages Page** (`/dashboard/admin/packages`)
   - When creating/editing: Add dropdown to select Supplier
   - Show supplier name in package details (admin view only)

3. **Flight Markup Page** (`/dashboard/admin/flight-markup`)
   - Input field for percentage
   - Toggle to activate/deactivate
   - List of historical markups

4. **Update Enquiries Page** (`/dashboard/admin/enquiries`)
   - Show supplier name when available
   - "Send to Supplier" button (manual re-send)
   - Quote form (basePrice + markupPercentage)

