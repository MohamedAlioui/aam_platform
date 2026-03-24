# Académie Arabe de la Mode — AAM Platform

> Full-stack MERN web application for the Arab Fashion Academy — Guinness World Record holder.
> Cinematic 3D experiences · RTL Arabic + French · Admin dashboard · 6ix Streetwear brand

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Three.js, React Three Fiber, Framer Motion, GSAP + ScrollTrigger, Tailwind CSS, Lenis, Zustand |
| Backend | Node.js, Express.js, MongoDB + Mongoose, JWT, Multer, Nodemailer, Socket.io |

---

## Project Structure

```
aam-platform/
├── client/              ← React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── 3d/      ← All Three.js scenes
│       │   ├── admin/   ← Dashboard components
│       │   ├── layout/  ← Navbar, Footer, etc.
│       │   ├── sections/← Home page sections
│       │   └── ui/      ← Design system components
│       ├── pages/       ← Route pages
│       ├── store/       ← Zustand state
│       ├── hooks/       ← Custom hooks
│       └── utils/       ← API, animations, helpers
└── server/              ← Express API
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── uploads/
```

---

## Quick Setup

### 1. Clone & Install

```bash
# Install root dependencies
npm install

# Install all (server + client)
npm run install:all
```

### 2. Configure Environment

```bash
# Copy example env
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/aam_db
JWT_SECRET=your_ultra_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App passwords

### 3. Run Development

```bash
# Start both server and client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## Features

### 🎨 3D Scenes (Three.js + React Three Fiber)
| Scene | Route | Description |
|-------|-------|-------------|
| Hero Scene | `/` | Cloth simulation + particle field + bloom |
| Course Carousel | `/courses` | 3D rotating card carousel |
| Gallery 3D | `/gallery` | Floating images in 3D space |
| Product Viewer | `/shop` | 3D garment viewer with OrbitControls |
| Building Scene | `/about` | AAM pillars building + Guinness medal |
| Loading Screen | `/` | 3D letter assembly intro (3s) |

### 🎬 Animations
- **GSAP ScrollTrigger**: Cinematic scroll journey, horizontal scroll, counter animations
- **Framer Motion**: Page transitions (blur + slide), micro interactions, cart drawer
- **Lenis**: Silky smooth scroll (easing: 0.08)

### 🌐 Bilingual
- Arabic (primary, RTL) via Cairo font
- French (secondary, LTR) via Playfair Display / Cormorant Garamond

### 👑 Admin Dashboard
- Stats overview with animated counters
- Revenue & courses charts (Recharts)
- Courses CRUD with image upload
- Registrations management
- Gallery manager (upload/delete)
- **Live notifications** via Socket.io (new registrations, new orders)

### 🛍️ Brand 6ix Shop
- Strictly black & white universe
- 3D product viewer (T-shirt, Hoodie, Cap)
- Color toggle (black/white) updates 3D material live
- Cart drawer with spring physics

---

## API Endpoints

```
POST   /api/auth/register        — Register
POST   /api/auth/login           — Login
GET    /api/auth/me              — Profile (auth)

GET    /api/courses              — List courses
GET    /api/courses/:id          — Course detail
POST   /api/courses              — Create (admin)
PUT    /api/courses/:id          — Update (admin)
DELETE /api/courses/:id          — Delete (admin)

POST   /api/registrations        — Register for course (auth)
GET    /api/registrations/my     — My registrations (auth)
GET    /api/registrations        — All registrations (admin)
PUT    /api/registrations/:id    — Update status (admin)

GET    /api/products             — List 6ix products
POST   /api/products             — Create (admin)
POST   /api/orders               — Place order (auth)

GET    /api/gallery              — Gallery images
POST   /api/gallery              — Upload image (admin)
DELETE /api/gallery/:id          — Delete (admin)

POST   /api/contact              — Send contact email
```

---

## Create First Admin

After registration, manually update the user role in MongoDB:
```js
db.users.updateOne({ email: "admin@aam.ma" }, { $set: { role: "admin" } })
```

---

## Build for Production

```bash
npm run build
# client/dist/ is ready to deploy
```

---

## Design System

| Token | Value | Use |
|-------|-------|-----|
| `--navy-deep` | `#050d1f` | Dark background |
| `--cyan` | `#00b8d4` | Primary accent |
| `--gold` | `#c9a84c` | Guinness Record only |
| `--blue-light` | `#4fc3f7` | Particles, secondary |

**Fonts**: Playfair Display (display) · Cairo (Arabic) · Cormorant Garamond (editorial) · Space Mono (mono/data)

---

*Built with passion for Académie Arabe de la Mode — صُنع بشغف لأكاديمية عربية للموضة*
