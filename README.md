# 🔍 HyperLocal Lens

> **Discover. Connect. Broadcast — Hyperlocally.**

A full-stack platform that helps small local businesses reach customers within a **5 km radius** using geo-targeted broadcasts, real-time alerts, and a built-in chat system.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black?logo=socket.io)](https://socket.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📸 Overview

HyperLocal Lens bridges the gap between local businesses and nearby customers by combining:

- 📡 **Real-time broadcast alerts** powered by Socket.io
- 🗺️ **Interactive dark map** with Leaflet + OpenStreetMap (CartoDB Dark theme)
- 📍 **MongoDB 2dsphere geospatial queries** for 5 km radius discovery
- 💬 **In-app chat** between customers and businesses
- 🔐 **JWT-based auth** with role-based access (user vs. business)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js v18+, Express.js, MongoDB Atlas |
| **Frontend** | React 18 (Vite), Tailwind CSS v3 |
| **Real-time** | Socket.io v4 (broadcasts + chat + typing indicators) |
| **Maps** | Leaflet + React-Leaflet + OpenStreetMap (CartoDB Dark) |
| **Auth** | JWT + bcryptjs |
| **HTTP Client** | Axios with request interceptors |

---

## 📁 Project Structure

```
HyperLocal-Lens/
│
├── Server/                          # Node.js / Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   └── cloudinary.js            # (Optional) Cloudinary config
│   ├── controllers/
│   │   ├── auth.controller.js       # Register / Login / Me
│   │   ├── business.controller.js   # Business CRUD + geosearch
│   │   ├── broadcast.controller.js  # Broadcasts + Socket emit
│   │   └── chat.controller.js       # Chat rooms + messages
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   ├── role.middleware.js       # Business role guard
│   │   └── error.middleware.js      # Global error handler
│   ├── models/
│   │   ├── user.model.js            # User + bcrypt password hash
│   │   ├── business.model.js        # Business + 2dsphere geo index
│   │   ├── broadcast.model.js       # Broadcast with TTL expiry
│   │   ├── chat.model.js            # Chat between user & business
│   │   └── message.model.js         # Individual chat messages
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── business.routes.js
│   │   ├── broadcast.routes.js
│   │   └── chat.routes.js
│   ├── utils/
│   │   ├── generateToken.js         # JWT token factory
│   │   ├── apiResponse.js           # Standardised API response
│   │   └── geoQuery.js              # MongoDB $near query builder
│   ├── jobs/
│   │   └── expireBroadcast.job.js   # Cleanup job (every 10 min)
│   ├── app.js                       # Express app + middleware setup
│   ├── server.js                    # HTTP server + Socket.io entry
│   ├── .env.example                 # Environment variable template
│   └── package.json
│
├── Client/                          # React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx          # Shared login/register form
│   │   │   ├── BroadcastCard.jsx     # Broadcast display card
│   │   │   ├── BusinessCard.jsx      # Business listing card
│   │   │   ├── ChatList.jsx          # Sidebar: list of chats
│   │   │   ├── ChatWindow.jsx        # Full chat UI + typing indicators
│   │   │   ├── MapView.jsx           # Leaflet dark map + markers
│   │   │   ├── Navbar.jsx            # Responsive nav + live indicator
│   │   │   ├── NotificationToast.jsx # Real-time broadcast popup
│   │   │   └── LogoutButton.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global auth state
│   │   │   └── SocketContext.jsx     # Socket.io connection provider
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── UserDashboard.jsx     # Map + broadcasts + chat
│   │   │   └── BusinessDashboard.jsx # Create broadcasts + manage chat
│   │   ├── services/
│   │   │   └── api.js                # Axios instance + interceptors
│   │   ├── App.jsx                   # React Router + auth guards
│   │   ├── main.jsx                  # App entry point
│   │   └── index.css                 # Tailwind + custom design tokens
│   ├── .env.example                  # Environment variable template
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🗺️ **Interactive Dark Map** | Leaflet + CartoDB dark tiles, custom markers for businesses & broadcasts |
| 📡 **Real-time Broadcasts** | Business posts a deal/alert → all nearby users get an instant Socket.io push |
| 💬 **In-app Chat** | Direct messaging between customers and businesses, with typing indicators |
| 🔐 **JWT Auth** | Secure login/register with role-based guards (`user` / `business`) |
| 📍 **Geo Queries** | MongoDB `$near` with `2dsphere` index — discovers within 5 km radius |
| ⏰ **Auto-Expiry** | Background job (every 10 min) purges expired broadcasts |
| 🔴 **Live Indicator** | Navbar shows real-time socket connection status |



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

---

## 🔌 API Reference

### Auth

| Method | Route | Auth | Body | Description |
|--------|-------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | `name, email, password, role` | Register user or business |
| `POST` | `/api/auth/login` | ❌ | `email, password` | Login and receive JWT |
| `GET`  | `/api/auth/me` | ✅ | — | Get current user profile |

### Business

| Method | Route | Auth | Query / Body | Description |
|--------|-------|------|--------------|-------------|
| `POST` | `/api/business/register` | ✅ Business | `name, address, category, lat, lng` | Register a business with location |
| `GET`  | `/api/business/nearby` | ✅ | `?lat=&lng=` | Businesses within 5 km |
| `GET`  | `/api/business/my` | ✅ Business | — | Get own business profile |

### Broadcast

| Method | Route | Auth | Query / Body | Description |
|--------|-------|------|--------------|-------------|
| `POST` | `/api/broadcast/create` | ✅ Business | `title, message, expiresAt` | Create broadcast (emits socket event) |
| `GET`  | `/api/broadcast/nearby` | ✅ | `?lat=&lng=` | Active broadcasts within 5 km |
| `GET`  | `/api/broadcast/my` | ✅ Business | — | Own broadcasts |

### Chat

| Method | Route | Auth | Body | Description |
|--------|-------|------|------|-------------|
| `POST` | `/api/chat/start` | ✅ | `businessId` | Start or resume a chat with a business |
| `GET`  | `/api/chat/list` | ✅ | — | All chats for current user |
| `GET`  | `/api/chat/:chatId/messages` | ✅ | — | Message history for a chat |
| `POST` | `/api/chat/:chatId/message` | ✅ | `text` | Send a message |
| `DELETE` | `/api/chat/:chatId` | ✅ | — | Delete a chat and its messages |

### Health Check

| Method | Route | Response |
|--------|-------|---------|
| `GET` | `/api/health` | `{ success: true, message: "...", timestamp: "..." }` |

---

## ⚡ Socket.io Events

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `newBroadcast` | `{ broadcast }` | New broadcast created by a nearby business |
| `newMessage` | `{ message }` | New chat message received |
| `userTyping` | `{ chatId, userName }` | Someone is typing in a chat |
| `userStoppedTyping` | `{ chatId }` | Typing indicator cleared |
| `newChatNotification` | `{ chatId, message }` | New chat/message notification |

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `joinUserRoom` | `userId` | Join personal notification room |
| `joinChat` | `chatId` | Join a specific chat room |
| `leaveChat` | `chatId` | Leave a chat room |
| `typing` | `{ chatId, userName }` | Broadcast typing indicator |
| `stopTyping` | `{ chatId }` | Clear typing indicator |
| `joinGeoRoom` | `{ lat, lng }` | Join geo-based room for area alerts |
| `leaveGeoRoom` | `{ lat, lng }` | Leave geo-based room |

---



## 🗂 Data Models

### User
```
{ name, email, password (hashed), role: "user" | "business", createdAt }
```

### Business
```
{ owner (ref: User), name, address, category, location: { type: "Point", coordinates: [lng, lat] }, ... }
```

### Broadcast
```
{ business (ref: Business), title, message, location, expiresAt, createdAt }
```

### Chat
```
{ participants: [UserId], business (ref: Business), lastMessage: { text, sender, timestamp }, unreadCount: Map }
```

### Message
```
{ chatId (ref: Chat), senderId (ref: User), text, createdAt }
```

---

## 📋 Roadmap

- [ ] Verified business badge system
- [ ] Broadcast boost (priority ordering)
- [ ] Analytics dashboard (view counts, engagement)
- [ ] Category & keyword filtering on map
- [ ] Push notifications (PWA)
- [ ] Image uploads for broadcasts (Cloudinary)

---

## 📄 License

[MIT](LICENSE) © 2024 Yaman Sharma
