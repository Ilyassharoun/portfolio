# 🚀 Fullstack Developer Portfolio

Welcome to my personal developer portfolio!  
This project showcases my skills, projects, and experience as a **Fullstack Software Developer**.

Built with a modern **React (Vite + TypeScript) frontend**, **Node.js/Express/TypeScript backend**, and **MongoDB database**.

[![React](https://img.shields.io/badge/React-19-brightgreen)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-blue)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)

## 🌐 Live Demo

**Frontend:** https://your-frontend-url.onrender.com *(Replace with actual URL)*  
**Backend API:** https://your-backend-api.onrender.com *(Replace with actual URL)*

Hosted on **Render** with **MongoDB Atlas**.

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (Build Tool)
- Material-UI (MUI)
- Lucide React Icons
- Responsive CSS

### Backend
- Node.js + Express
- TypeScript
- Mongoose ODM
- Swagger API Docs
- Nodemailer
- CORS & Sessions

### Database
- MongoDB (Atlas)

### Tools
- Render (Deployment)
- Vite (Dev Server)
- ts-node-dev (Backend Hot Reload)

## 📁 Project Structure

```
portfolio/
│
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── config/db.ts
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Hero/
    │   │   ├── About/
    │   │   ├── Skills/
    │   │   ├── Experience/
    │   │   ├── Projects/
    │   │   └── Contact/
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## ⚙️ Local Setup & Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Ilyassharoun/portfolio.git
cd portfolio
```

2. **Backend Setup:**
```bash
cd backend
npm install
```

3. **Frontend Setup:**
```bash
cd ../frontend
npm install
```

### 🌍 Environment Variables

Create `backend/.env`:
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=development
# Optional: JWT_SECRET=your_secret_key
# EMAIL_USER=your_email
# EMAIL_PASS=your_app_password
```

**Get MongoDB Atlas URI:** Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas).

## ▶️ Run the Project

### Backend:
```bash
cd backend
npm run dev
```
*Server runs on http://localhost:5000 | Swagger: http://localhost:5000/api-docs*

### Frontend:
```bash
cd frontend
npm run dev
```
*App runs on http://localhost:5173 (Vite default)*

**Connect frontend to backend by updating API base URL in frontend src (if needed).**

## 🚀 Deployment (Render)

1. **Backend (Web Service):**
   - Push to GitHub
   - New Web Service → Connect repo → `npm install` → `npm run build && npm start`
   - Env vars: MONGODB_URI, PORT=5000

2. **Frontend (Static Site):**
   - New Static Site → Connect repo → Build: `npm install && npm run build`
   - Publish dir: `dist`

## 📌 Key Features

- ✅ Fully responsive design (mobile-first)
- ✅ Hero section with profile & CTA
- ✅ About, Skills, Experience sections
- ✅ Projects showcase with images
- ✅ Contact form with email backend
- ✅ REST API with Swagger docs
- ✅ MongoDB for reviews/projects data
- ✅ Dark/Light theme ready
- ✅ Production-ready deployment

