# Frontend - React Application

This directory contains the frontend code for the project, built with [React](https://reactjs.org/) and managed using [npm](https://www.npmjs.com/). It includes development, build, and dependency instructions for running and contributing to the frontend.

---

## 🧱 Tech Stack

- **Framework**: React
- **Package Manager**: npm
- **Build Tool**: Vite 
- **Styling**: Tailwind CSS

---

## 📦 Getting Started

Before starting, make sure you have [Node.js](https://nodejs.org/) and npm installed.

### 1. Install Dependencies

Install all required packages:

```bash
npm install
```

### 2. Start the dev server with hot-reloading:

```bash
npm run dev
```
By default, the app will be served at: http://localhost:5173/


### 3. Build for Production
Generate optimized static assets for deployment:
```bash
npm run build
```

The compiled directory will be output in backend/app/static and you can serve directly with python flask webserver