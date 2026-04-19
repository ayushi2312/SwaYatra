# SWA-YATRA - Quick Workflow Summary

## 🎯 Main User Flows

### Flow 1: New User Registration & Booking
```
1. Visit Site → 2. Sign Up (Indian/Foreigner) → 3. Login → 4. Browse Places
    ↓
5. Select Place → 6. Click "Book Now" → 7. Fill Booking Form
    ↓
8. Click "Confirm" → 9. Payment Gateway → 10. Complete Payment
    ↓
11. QR Code Generated → 12. Booking Saved → 13. Success Screen
    ↓
14. View in "My Bookings" → 15. Show QR at Entrance
```

### Flow 2: Chatbot Interaction
```
1. Click Chat Button → 2. Type Query → 3. System Detects Mode
    ↓
    ├─ Tourist Mode → Monument Info / Food / Guides
    └─ Analytics Mode → Footfall / Trends / Statistics
    ↓
4. Display Response → 5. Continue Conversation
```

### Flow 3: Analytics Dashboard
```
1. Click "Analytics" → 2. Select Tab (Footfall/Hotels/Trends)
    ↓
3. Real-time Data Updates (5-15s intervals)
    ↓
4. View Statistics → 5. Identify Insights → 6. Make Decisions
```

---

## 📊 System Components Flow

```
┌─────────────┐
│   USER      │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Homepage │  │ Chatbot  │  │Analytics│  │ Bookings │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │             │
     │             │              │             │
     └─────────────┴──────────────┴─────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Data Layer      │
         │  (localStorage)  │
         └──────────────────┘
```

---

## 🔄 Booking Process (Detailed)

```
STEP 1: SELECTION
┌─────────────────┐
│ Browse Places   │ → Select Category → View Place Card
└─────────────────┘

STEP 2: BOOKING FORM
┌─────────────────┐
│ Click "Book Now"│ → Modal Opens → Fill Details:
│                 │   • Date
│                 │   • Time  
│                 │   • Visitors
│                 │   • Name/Email/Phone
└─────────────────┘

STEP 3: PAYMENT
┌─────────────────┐
│ Confirm Booking │ → Generate Booking ID → Open Payment
│                 │ → Select Method (Card/UPI/Wallet)
│                 │ → Enter Details → Process Payment
└─────────────────┘

STEP 4: CONFIRMATION
┌─────────────────┐
│ Payment Success │ → Generate QR Code → Save to DB
│                 │ → Show Success Modal → Display QR
└─────────────────┘

STEP 5: MANAGEMENT
┌─────────────────┐
│ My Bookings     │ → View All Bookings → Show/Hide QR
│                 │ → Download Ticket → Cancel if needed
└─────────────────┘
```

---

## 💾 Data Storage Structure

```
localStorage
├── swa-yatra-auth
│   └── { email, name, userType, loggedIn }
│
└── swa-yatra-bookings
    └── [
          {
            id, placeId, placeName,
            date, time, visitors,
            name, email, phone,
            amount, paymentStatus, paymentId,
            qrCode, bookingDate, status
          },
          ...
        ]
```

---

## 🎨 UI Component Hierarchy

```
app/page.tsx (Homepage)
│
├── Header
│   ├── Logo
│   ├── Navigation (Analytics/Bookings)
│   └── User Info
│
├── Category Filters
│   └── All / Monuments / Religious / Forts / Palaces
│
├── Place Cards Grid
│   └── PlaceCard (×N)
│       ├── Image
│       ├── Details
│       └── BookingModal
│           ├── Form
│           ├── PaymentGateway
│           └── QR Code
│
└── ChatBotButton
    └── ChatInterface
        ├── Messages
        └── ResponseDisplay
```

---

## 🔐 Authentication Flow

```
┌──────────┐
│  Start   │
└────┬─────┘
     │
     ▼
┌──────────┐      NO
│Logged In?│─────────▶ /login
└────┬─────┘
     │ YES
     ▼
┌──────────┐
│ Homepage │
└──────────┘

Login Process:
1. Enter Email/Password
2. OR Sign Up (Indian/Foreigner)
3. Fill Required Fields
4. Submit → Save to localStorage
5. Redirect to Homepage
```

---

## 📱 Mobile/Responsive Flow

```
Desktop View:
┌─────────────────────────────┐
│ Header | Nav | User | Logout│
├─────────────────────────────┤
│  [Category Filters]         │
├─────────────────────────────┤
│ [Card] [Card] [Card] [Card] │
│ [Card] [Card] [Card] [Card] │
└─────────────────────────────┘
         [Chat Button]

Mobile View:
┌─────────────┐
│  Header     │
├─────────────┤
│ [Filters]   │
├─────────────┤
│   [Card]    │
│   [Card]    │
│   [Card]    │
└─────────────┘
  [Chat]
```

---

## 🚀 Key Features Implementation

### 1. Real-time Analytics
- **Update Interval**: 5-15 seconds
- **Live Indicator**: Green pulsing badge
- **Pause/Resume**: User control
- **Data Source**: Simulated (ready for API)

### 2. Payment Gateway
- **Methods**: Card, UPI, Digital Wallets
- **Security**: SSL-ready structure
- **Processing**: Simulated (2s delay)
- **Verification**: Payment ID generation

### 3. QR Code System
- **Generation**: After payment success
- **Content**: Booking JSON data
- **Display**: Modal + Bookings page
- **Usage**: Entrance scanning

### 4. Database (localStorage)
- **Bookings**: Array of booking objects
- **Auth**: User session data
- **Structure**: JSON format
- **Ready for**: Real database migration

---

## 📋 File Structure Reference

```
hack/
├── app/
│   ├── page.tsx              # Homepage with place cards
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup (Indian/Foreigner)
│   ├── bookings/page.tsx     # My Bookings page
│   └── analytics/page.tsx    # Analytics dashboard
│
├── components/
│   ├── PlaceCard.tsx         # Place card with booking
│   ├── BookingModal.tsx      # Booking form + payment
│   ├── PaymentGateway.tsx    # Payment processing
│   ├── ChatBotButton.tsx     # Floating chat button
│   ├── ChatInterface.tsx    # Chat UI
│   └── ResponseDisplay.tsx   # Chat responses
│
├── data/
│   ├── monuments.ts          # Place data (Jaipur/Delhi)
│   ├── hotels.ts             # Hotel data
│   ├── footfall.ts           # Footfall analytics
│   ├── recommendations.ts    # Food/Guides/Transport
│   └── trends.ts             # Tourism trends
│
└── utils/
    ├── database.ts           # Booking storage
    ├── auth.ts               # Authentication
    ├── responseGenerator.ts  # Chat logic
    └── translations.ts       # Multi-language
```

---

## 🎯 Quick Reference: Common Actions

| Action | Flow | Result |
|--------|------|--------|
| **Book a Place** | Homepage → Card → Book Now → Form → Payment → QR | Booking Confirmed |
| **View Bookings** | Header → "My Bookings" | List of all bookings |
| **Use Chatbot** | Click Chat Button → Type Query | Get Information |
| **View Analytics** | Header → "Analytics" → Select Tab | Real-time Stats |
| **Change Language** | Language Selector | UI Updates |
| **Download Ticket** | Bookings Page → Download | JSON File |

---

## 🔄 State Management Flow

```
Component State:
├── User Input → useState()
├── API Calls → useEffect()
├── Data Updates → setState()
└── Navigation → useRouter()

Persistent Storage:
├── Authentication → localStorage
├── Bookings → localStorage
└── Preferences → localStorage

Real-time Updates:
├── Analytics → setInterval()
├── Footfall → 5s refresh
└── Live Indicator → State toggle
```

---

This workflow document provides a complete overview of how SWA-YATRA operates from user interaction to data storage and back.

