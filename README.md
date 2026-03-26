# 🔍 HyperLocal Lens

> **Discover. Connect. Broadcast — Hyperlocally.**

A full-stack platform that helps small local businesses reach customers within a **5 km radius** using geo-targeted broadcasts, real-time alerts, and a built-in chat system.

---

## Overview

HyperLocal Lens bridges the gap between local businesses and nearby customers by combining:

-  **Real-time broadcast alerts** powered by Socket.io
-  **Interactive dark map** with Leaflet + OpenStreetMap (CartoDB Dark theme)
-  **MongoDB 2dsphere geospatial queries** for 5 km radius discovery
-  **In-app chat** between customers and businesses
-  **JWT-based auth** with role-based access (user vs. business)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend| Node.js v18+, Express.js, MongoDB Atlas |
| Frontend | React 18 (Vite), Tailwind CSS v3 |
| Real-time | Socket.io v4 (broadcasts + chat + typing indicators) |
| Maps| Leaflet + React-Leaflet + OpenStreetMap (CartoDB Dark) |
| Auth | JWT + bcryptjs |
| HTTP Client| Axios with request interceptors 


Features

| Feature | Details |

|Real-time Broadcasts** | Business posts a deal/alert → all nearby users get an instant Socket.io push |
|In-app Chat** | Direct messaging between customers and businesses, with typing indicators |
|JWT Auth** | Secure login/register with role-based guards (`user` / `business`) |
|Geo Queries** | MongoDB `$near` with `2dsphere` index — discovers within 5 km radius |
|Auto-Expiry** | Background job (every 10 min) purges expired broadcasts |
|Live Indicator** | Navbar shows real-time socket connection status |



---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+
- A **MongoDB Atlas** free-tier cluster

### 1 — Clone the repo

```bash
git clone https://github.com/yamansharma5/HyperLocal-Lens.git
cd HyperLocal-Lens
```

### 2 — Backend Setup

```bash
cd Server
npm install

# Copy the env template and fill in your values
cp .env.example .env
```

Edit `Server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hyperlocal?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev        # Starts on http://localhost:5000
```

### 3 — Frontend Setup

```bash
cd Client
npm install

# Copy the env template and fill in your values
cp .env.example .env
```

Edit `Client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev        # Starts on http://localhost:5173
```


Data Models
User
{ name, email, password (hashed), role: "user" | "business", createdAt }

Business
{ owner (ref: User), name, address, category, location: { type: "Point", coordinates: [lng, lat] }, ... }

Broadcast
{ business (ref: Business), title, message, location, expiresAt, createdAt }



Roadmap

- [ ] Verified business badge system
- [ ] Broadcast boost (priority ordering)
- [ ] Analytics dashboard (view counts, engagement)
- [ ] Category & keyword filtering on map
- [ ] Push notifications (PWA)
- [ ] Image uploads for broadcasts (Cloudinary)

---

## 📄 License

[MIT](LICENSE) © 2024 Yaman Sharma
