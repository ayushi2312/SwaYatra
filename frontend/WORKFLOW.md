# SWA-YATRA - Complete Workflow Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SWA-YATRA TOURISM SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   TOURIST    │    │  ANALYTICS   │    │   BOOKING    │
│   ASSISTANT  │    │   DASHBOARD  │    │   SYSTEM     │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 1. USER AUTHENTICATION FLOW

```
┌─────────────┐
│   START     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Visit Website  │
│  (localhost:3000)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│  Check Auth     │──────▶│ Not Logged In│
│  Status         │      └──────┬───────┘
└──────┬──────────┘             │
       │                        ▼
       │                ┌──────────────┐
       │                │  Login Page   │
       │                └──────┬───────┘
       │                       │
       │                       ▼
       │                ┌─────────────────┐
       │                │ Select User Type │
       │                │ (Indian/Foreigner)│
       │                └──────┬──────────┘
       │                       │
       │                       ▼
       │                ┌─────────────────┐
       │                │ Fill Form       │
       │                │ (Aadhaar/Passport)│
       │                └──────┬──────────┘
       │                       │
       │                       ▼
       │                ┌─────────────────┐
       │                │ Submit & Save   │
       │                │ to localStorage │
       │                └──────┬──────────┘
       │                       │
       └───────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  Logged In      │
         │  Redirect to    │
         │  Homepage       │
         └─────────────────┘
```

---

## 2. HOMEPAGE BROWSING FLOW

```
┌─────────────────┐
│   Homepage      │
│   (Category View)│
└────────┬────────┘
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│  Select Category │              │  Floating Chat   │
│  (All/Monuments/ │              │  Button Click    │
│   Religious/etc) │              └────────┬─────────┘
└────────┬─────────┘                       │
         │                                 ▼
         ▼                        ┌──────────────────┐
┌──────────────────┐              │  Chat Interface  │
│  Display Places  │              │  Opens in Modal  │
│  in Grid Cards   │              └──────────────────┘
└────────┬─────────┘
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│  View Place      │              │  Click "Book Now"│
│  Details         │              │  Button          │
└──────────────────┘              └────────┬─────────┘
                                            │
                                            ▼
```

---

## 3. BOOKING FLOW (Complete Process)

```
┌─────────────────────┐
│  Click "Book Now"   │
│  on Place Card      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Booking Modal Opens│
│  ─────────────────  │
│  • Date Picker      │
│  • Time Selection   │
│  • Visitor Count    │
│  • Contact Info     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Fill Booking Form  │
│  ─────────────────  │
│  Name: [_______]    │
│  Email: [_______]   │
│  Phone: [_______]   │
│  Date: [_______]    │
│  Time: [_______]    │
│  Visitors: [___]    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Click "Confirm     │
│  Booking"           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generate Booking ID│
│  (SWA-{timestamp})  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Calculate Amount   │
│  (₹50 × visitors)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Open Payment       │
│  Gateway Modal      │
└──────────┬──────────┘
           │
           ▼
```

---

## 4. PAYMENT GATEWAY FLOW

```
┌─────────────────────┐
│  Payment Gateway    │
│  Modal Opens        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Select Payment     │
│  Method:            │
│  ┌─────┬─────┬────┐│
│  │Card │ UPI │Wall││
│  └─────┴─────┴────┘│
└──────────┬──────────┘
           │
           ├──────────────┬──────────────┬──────────────┐
           │              │              │              │
           ▼              ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  CARD    │  │   UPI    │  │  WALLET  │  │  Cancel  │
    │  Payment │  │  Payment │  │  Payment │  │  (Back) │
    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │              │             │
         │             │              │             │
         └─────────────┴──────────────┴─────────────┘
                       │
                       ▼
         ┌─────────────────────┐
         │  Enter Payment      │
         │  Details            │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Click "Pay Now"    │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Process Payment    │
         │  (Simulated)        │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Generate Payment ID│
         │  (PAY-{timestamp}) │
         └──────────┬──────────┘
                    │
                    ▼
```

---

## 5. BOOKING CONFIRMATION & QR CODE GENERATION

```
┌─────────────────────┐
│  Payment Success    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Create Booking     │
│  Object:            │
│  ─────────────────  │
│  • bookingId       │
│  • placeId         │
│  • date, time      │
│  • visitors        │
│  • amount          │
│  • paymentId       │
│  • paymentStatus   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generate QR Code   │
│  Data (JSON):       │
│  ─────────────────  │
│  {                  │
│    bookingId: "...",│
│    placeName: "...",│
│    date: "...",     │
│    time: "...",     │
│    visitors: N,     │
│    paymentId: "..." │
│  }                  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Convert to QR Code │
│  (QRCodeSVG)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Save to Database   │
│  (localStorage)     │
│  ─────────────────  │
│  • Store booking    │
│  • Store QR code    │
│  • Link to user     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Show Success Modal │
│  ─────────────────  │
│  ✓ Booking Confirmed│
│  ┌───────────────┐  │
│  │   QR CODE     │  │
│  │   [Image]     │  │
│  └───────────────┘  │
│  Booking ID: ...    │
│  [My Bookings] [OK] │
└──────────┬──────────┘
           │
           ├──────────────────────┐
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│  Click "My       │    │  Click "OK"      │
│  Bookings"       │    │  (Close Modal)   │
└──────────┬───────┘    └──────────────────┘
           │
           ▼
┌──────────────────┐
│  Bookings Page   │
│  (/bookings)     │
└──────────────────┘
```

---

## 6. MY BOOKINGS PAGE FLOW

```
┌─────────────────────┐
│  Access Bookings    │
│  Page (/bookings)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Check Authentication│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Get User Email     │
│  from Auth          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Query Database     │
│  getUserBookings()  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Filter Bookings    │
│  by User Email      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Display Bookings  │
│  ─────────────────  │
│  For each booking:  │
│  • Place Name       │
│  • Date & Time      │
│  • Visitors         │
│  • Amount           │
│  • Status Badge     │
│  • QR Code (Show)   │
│  • Download Button  │
│  • Cancel Button    │
└─────────────────────┘
```

---

## 7. CHATBOT FLOW

```
┌─────────────────────┐
│  Click Floating     │
│  Chat Button        │
│  (Bottom Right)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Chat Modal Opens   │
│  (400x600px)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Display Welcome    │
│  Message            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User Types Query   │
│  ─────────────────  │
│  Examples:          │
│  • "Tell me about   │
│    Hawa Mahal"      │
│  • "Show footfall"  │
│  • "Where to eat?"  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Detect Mode        │
│  ─────────────────  │
│  • Analytics Mode?  │
│  • Tourist Mode?    │
└──────────┬──────────┘
           │
           ├──────────────────────┐
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│  TOURIST MODE    │    │  ANALYTICS MODE  │
│  ──────────────  │    │  ──────────────  │
│  • Monument Info │    │  • Footfall Data │
│  • Food Recs     │    │  • Hotel Stats  │
│  • Guides        │    │  • Trends       │
│  • Transport     │    │  • Insights     │
└──────────┬───────┘    └──────────┬───────┘
           │                      │
           └──────────┬───────────┘
                      │
                      ▼
         ┌─────────────────────┐
         │  Generate Response  │
         │  (responseGenerator)│
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Display Response   │
         │  (ResponseDisplay)   │
         └─────────────────────┘
```

---

## 8. ANALYTICS DASHBOARD FLOW

```
┌─────────────────────┐
│  Click "Analytics"  │
│  in Header          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Analytics Page     │
│  (/analytics)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Tab Selection:     │
│  ┌─────┬─────┬────┐ │
│  │Foot│Hotel│Trend│ │
│  └─────┴─────┴────┘ │
└──────────┬──────────┘
           │
           ├──────────────┬──────────────┬──────────────┐
           │              │              │              │
           ▼              ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ FOOTFALL │  │  HOTEL   │  │  TRENDS │  │  LIVE    │
    │ DASHBOARD│  │ ANALYTICS│  │ & INSIGHTS│  │  UPDATE │
    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │              │              │
         │             │              │              │
         └─────────────┴──────────────┴──────────────┘
                       │
                       ▼
         ┌─────────────────────┐
         │  Real-time Updates  │
         │  ─────────────────  │
         │  • Footfall: 5s     │
         │  • Hotels: 10s      │
         │  • Trends: 15s      │
         │  • Live Indicator   │
         │  • Pause/Resume     │
         └─────────────────────┘
```

---

## 9. DATA FLOW DIAGRAM

```
┌──────────────┐
│   USER       │
└──────┬───────┘
       │
       │ Actions
       │
       ▼
┌─────────────────────────────────────────┐
│         FRONTEND (Next.js)             │
│  ────────────────────────────────────  │
│  • Pages (app/)                        │
│  • Components (components/)            │
│  • UI/UX                               │
└──────┬─────────────────────────────────┘
       │
       │ API Calls / Functions
       │
       ▼
┌─────────────────────────────────────────┐
│         BUSINESS LOGIC                   │
│  ────────────────────────────────────   │
│  • utils/responseGenerator.ts           │
│  • utils/database.ts                    │
│  • utils/auth.ts                       │
└──────┬─────────────────────────────────┘
       │
       │ Data Operations
       │
       ▼
┌─────────────────────────────────────────┐
│         DATA LAYER                      │
│  ────────────────────────────────────   │
│  • data/monuments.ts                    │
│  • data/hotels.ts                       │
│  • data/footfall.ts                     │
│  • data/recommendations.ts              │
│  • data/trends.ts                       │
│  • localStorage (Bookings)              │
│  • localStorage (Auth)                  │
└─────────────────────────────────────────┘
```

---

## 10. COMPLETE USER JOURNEY

```
START
  │
  ▼
┌─────────────────┐
│ Visit Website   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      NO
│ Authenticated?  │──────────▶ Login/Signup
└────────┬────────┘
         │ YES
         ▼
┌─────────────────┐
│   Homepage      │
│  ─────────────  │
│  • Browse Places│
│  • Categories   │
│  • Chat Bot     │
└────────┬────────┘
         │
         ├──────────────────────┬──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Book Place  │    │  Use Chatbot │    │  View       │
│              │    │              │    │  Analytics   │
└──────┬───────┘    └──────┬───────┘    └──────┬──────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Fill Form   │    │ Get Info     │    │ View Stats   │
│ → Payment   │    │ & Recs       │    │ & Insights   │
│ → QR Code   │    │              │    │              │
└──────┬───────┘    └──────────────┘    └──────────────┘
       │
       ▼
┌──────────────┐
│ View Booking │
│ in /bookings │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Show QR Code │
│ at Entrance  │
└──────┬───────┘
       │
       ▼
      END
```

---

## 11. KEY COMPONENTS INTERACTION

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────┘

app/page.tsx (Homepage)
    │
    ├──► Header.tsx
    │       ├──► Navigation
    │       ├──► User Info
    │       └──► Logout
    │
    ├──► PlaceCard.tsx (Multiple)
    │       ├──► Image Display
    │       ├──► Place Details
    │       └──► BookingModal.tsx
    │               ├──► Booking Form
    │               ├──► PaymentGateway.tsx
    │               │       ├──► Card Payment
    │               │       ├──► UPI Payment
    │               │       └──► Wallet Payment
    │               └──► QR Code Generation
    │
    └──► ChatBotButton.tsx
            └──► ChatInterface.tsx
                    ├──► ResponseDisplay.tsx
                    └──► LanguageSelector.tsx

app/bookings/page.tsx
    │
    ├──► Header.tsx
    └──► Booking Cards
            ├──► Booking Details
            ├──► QR Code Display
            ├──► Download Ticket
            └──► Cancel Booking

app/analytics/page.tsx
    │
    ├──► Header.tsx
    ├──► FootfallDashboard.tsx (Real-time)
    ├──► HotelAnalytics.tsx (Real-time)
    └──► TrendsDashboard.tsx (Real-time)
```

---

## 12. DATABASE SCHEMA (localStorage Structure)

```
Bookings Storage:
┌─────────────────────────────────────────────────┐
│ localStorage: 'swa-yatra-bookings'              │
│ ─────────────────────────────────────────────  │
│ [                                                │
│   {                                              │
│     id: "SWA-1234567890-ABC123",                │
│     placeId: "hawa-mahal",                      │
│     placeName: "Hawa Mahal",                    │
│     date: "2024-01-15",                         │
│     time: "10:00",                              │
│     visitors: 2,                                │
│     name: "John Doe",                           │
│     email: "john@example.com",                  │
│     phone: "+91 9876543210",                    │
│     amount: 100,                                │
│     paymentStatus: "completed",                 │
│     paymentId: "PAY-1234567890-XYZ789",         │
│     qrCode: "{...JSON...}",                    │
│     bookingDate: "2024-01-10T10:30:00Z",        │
│     status: "confirmed"                         │
│   },                                             │
│   ...                                            │
│ ]                                                │
└─────────────────────────────────────────────────┘

Auth Storage:
┌─────────────────────────────────────────────────┐
│ localStorage: 'swa-yatra-auth'                  │
│ ─────────────────────────────────────────────  │
│ {                                                │
│   email: "user@example.com",                    │
│   name: "User Name",                            │
│   userType: "indian" | "foreigner",             │
│   loggedIn: true                                │
│ }                                                │
└─────────────────────────────────────────────────┘
```

---

## 13. API/Function Call Flow

```
User Action → Component → Utility Function → Data Layer → Response

Example: Booking Flow
─────────────────────
User clicks "Book Now"
    │
    ▼
PlaceCard.tsx → BookingModal.tsx
    │
    ▼
User fills form → handleSubmit()
    │
    ▼
generateBookingId() → "SWA-{timestamp}-{random}"
    │
    ▼
PaymentGateway.tsx → handlePayment()
    │
    ▼
Payment Success → handlePaymentSuccess()
    │
    ▼
Generate QR Code → JSON.stringify(bookingData)
    │
    ▼
saveBooking() → localStorage.setItem()
    │
    ▼
Show Success Modal with QR Code
```

---

## 14. REAL-TIME UPDATE MECHANISM

```
Analytics Dashboard
    │
    │ useEffect Hook
    │
    ▼
┌─────────────────────┐
│  setInterval()      │
│  ─────────────────  │
│  Footfall: 5000ms   │
│  Hotels: 10000ms    │
│  Trends: 15000ms    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Fetch Latest Data  │
│  • getAllMonuments  │
│    Footfall()       │
│  • getDistrictHotel │
│    Stats()          │
│  • getTourismTrends()│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Update State       │
│  setRealTimeData()  │
│  setLastUpdate()    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Re-render UI       │
│  with New Data      │
│  Show Live Badge    │
└─────────────────────┘
```

---

## Summary

### Main Workflows:
1. **Authentication** → Login/Signup → Homepage
2. **Browsing** → Categories → Place Cards → Details
3. **Booking** → Form → Payment → QR Code → Database
4. **Chatbot** → Query → Mode Detection → Response
5. **Analytics** → Dashboard → Real-time Updates
6. **Bookings** → View → QR Code → Download/Cancel

### Key Features:
- ✅ Dual-mode chatbot (Tourist/Analytics)
- ✅ Real-time analytics updates
- ✅ Complete booking system with payment
- ✅ QR code generation for tickets
- ✅ Database storage (localStorage)
- ✅ Multi-language support
- ✅ Image matching system
- ✅ Payment gateway integration

