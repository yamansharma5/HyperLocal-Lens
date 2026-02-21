# Hyperlocal Lens ðŸ”ðŸ“¡

**A full-stack Hyperlocal Business Discovery & Real-Time Broadcast Platform**

Help small local businesses digitally reach customers within a **5km radius** using geo-targeted broadcasts and real-time alerts.

---

## ðŸ›  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js, MongoDB Atlas |
| **Frontend** | React (Vite), Tailwind CSS |
| **Real-time** | Socket.io |
| **Maps** | Leaflet + OpenStreetMap (CartoDB Dark Theme) |
| **Auth** | JWT + bcrypt |
| **Deployment** | Render (backend), Vercel (frontend) |

---

## ðŸ“ Project Structure

```
Hyperlocal lens/
â”œâ”€â”€ Server/                    # Backend API
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ db.js              # MongoDB connection
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ auth.controller.js
â”‚   â”‚   â”œâ”€â”€ business.controller.js
â”‚   â”‚   â””â”€â”€ broadcast.controller.js
â”‚   â”œâ”€â”€ middlewares/
â”‚   â”‚   â”œâ”€â”€ auth.middleware.js  # JWT verification
â”‚   â”‚   â”œâ”€â”€ role.middleware.js  # Business role guard
â”‚   â”‚   â””â”€â”€ error.middleware.js # Global error handler
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ user.model.js      # User with bcrypt
â”‚   â”‚   â”œâ”€â”€ business.model.js  # Business with 2dsphere
â”‚   â”‚   â””â”€â”€ broadcast.model.js # Broadcast with expiry
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ auth.routes.js
â”‚   â”‚   â”œâ”€â”€ business.routes.js
â”‚   â”‚   â””â”€â”€ broadcast.routes.js
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ generateToken.js   # JWT token generator
â”‚   â”‚   â”œâ”€â”€ apiResponse.js     # Standardized responses
â”‚   â”‚   â””â”€â”€ geoQuery.js        # MongoDB geo query builder
â”‚   â”œâ”€â”€ jobs/
â”‚   â”‚   â””â”€â”€ expireBroadcast.job.js  # Periodic cleanup
â”‚   â”œâ”€â”€ app.js                 # Express app setup
â”‚   â”œâ”€â”€ server.js              # Server + Socket.io entry
â”‚   â””â”€â”€ .env                   # Environment variables
â”‚
â”œâ”€â”€ Client/                    # Frontend SPA
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ Navbar.jsx         # Responsive nav with live indicator
â”‚   â”‚   â”‚   â”œâ”€â”€ AuthForm.jsx       # Login/Register form
â”‚   â”‚   â”‚   â”œâ”€â”€ MapView.jsx        # Leaflet map with dark theme
â”‚   â”‚   â”‚   â”œâ”€â”€ BroadcastCard.jsx  # Broadcast display card
â”‚   â”‚   â”‚   â”œâ”€â”€ BusinessCard.jsx   # Business display card
â”‚   â”‚   â”‚   â”œâ”€â”€ NotificationToast.jsx # Real-time alert popup
â”‚   â”‚   â”‚   â””â”€â”€ LogoutButton.jsx
â”‚   â”‚   â”œâ”€â”€ context/
â”‚   â”‚   â”‚   â”œâ”€â”€ AuthContext.jsx    # Auth state management
â”‚   â”‚   â”‚   â””â”€â”€ SocketContext.jsx  # Socket.io connection
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ LoginPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ RegisterPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ UserDashboard.jsx
â”‚   â”‚   â”‚   â””â”€â”€ BusinessDashboard.jsx
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â””â”€â”€ api.js             # Axios with interceptors
â”‚   â”‚   â”œâ”€â”€ App.jsx                # Routing + auth guards
â”‚   â”‚   â”œâ”€â”€ main.jsx               # Entry point
â”‚   â”‚   â””â”€â”€ index.css              # Tailwind + design system
â”‚   â”œâ”€â”€ tailwind.config.js
â”‚   â”œâ”€â”€ postcss.config.js
â”‚   â”œâ”€â”€ vite.config.js
â”‚   â””â”€â”€ .env
â”‚
â””â”€â”€ README.md
```

---

## ðŸš€ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- npm or yarn

### Backend Setup

```bash
cd Server
npm install
# Edit .env with your MongoDB Atlas URI and JWT secret
npm run dev   # Starts on port 5000
```

### Frontend Setup

```bash
cd Client
npm install
npm run dev   # Starts on port 5173
```

---

## ðŸ”Œ API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user/business |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (protected) |

### Business
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/business/register` | Register business (business role) |
| GET | `/api/business/nearby?lat=...&lng=...` | Get businesses within 5km |
| GET | `/api/business/my` | Get own business (business role) |

### Broadcast
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/broadcast/create` | Create broadcast (business role) |
| GET | `/api/broadcast/nearby?lat=...&lng=...` | Get active broadcasts within 5km |
| GET | `/api/broadcast/my` | Get own broadcasts (business role) |

### Socket.io Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `newBroadcast` | Server â†’ Client | Emitted when a new broadcast is created |
| `joinGeoRoom` | Client â†’ Server | Join geo-based room (future) |

---

## ðŸŒ Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Set root directory to `Server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env`

### Frontend (Vercel)
1. Import project on Vercel
2. Set root directory to `Client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL + `/api`
   - `VITE_SOCKET_URL`: Your Render backend URL

---

## âœ¨ Features

- ðŸ—ºï¸ **Interactive Dark Map** â€” Leaflet + CartoDB dark tiles with custom markers
- ðŸ“¡ **Real-time Broadcasts** â€” Socket.io powered instant notifications
- ðŸ” **JWT Authentication** â€” Secure login with role-based access
- ðŸ“ **Geospatial Queries** â€” MongoDB 2dsphere index for 5km radius search
- ðŸŽ¨ **Premium UI** â€” Glassmorphism, gradients, micro-animations
- ðŸ“± **Fully Responsive** â€” Works on mobile, tablet, and desktop
- â° **Auto Expiry** â€” Background job cleans expired broadcasts
- ðŸ” **Search & Filter** â€” Find businesses by name, address, or category

---

## ðŸ“‹ Optional Enhancements (Structure Ready)

- âœ… Verified business badge system
- ðŸš€ Broadcast boost system
- ðŸ“Š Analytics (view count)
- ðŸŒ Geo-room based real-time alerts
- ðŸ·ï¸ Category filtering
- ðŸ”Ž Search functionality

---

## ðŸ“„ License

MIT License

