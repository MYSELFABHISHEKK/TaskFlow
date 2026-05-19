# TaskFlow

TaskFlow is a production-ready team task management web application with JWT authentication, project management, role-based permissions, drag-and-drop kanban tasks, dashboard analytics, dark mode, and a polished minimalist SaaS interface.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Context API, Framer Motion, Recharts, react-hot-toast, lucide-react
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator, Socket.IO
- Deployment: Railway-ready single-service production mode serving the Vite build from Express

## Features

- Register, login, logout, persistent JWT sessions
- Admin and member roles with backend RBAC
- Project CRUD, project members, member invite by email
- Task CRUD, assignment, due dates, priority, status, search and filters
- Member users see assigned projects and assigned tasks
- Kanban board with drag-and-drop status updates
- Dashboard stats, bar chart, pie chart, progress indicators, recent activity
- Responsive sidebar shell, mobile menu, modal dialogs, loading states
- Dark/light theme toggle
- Socket.IO event hooks for real-time task updates

## Environment Variables

Backend: copy `backend/.env.example` to `backend/.env`.

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Frontend: copy `frontend/.env.example` to `frontend/.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Installation

```bash
npm install
npm run install:all
npm run dev
```

Or run separately:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Seed Demo Data

After setting `MONGO_URI` and `JWT_SECRET`:

```bash
cd backend
npm run seed
```

From the project root you can also run:

```bash
npm run seed
```

Demo credentials:

- Admin: `admin@taskflow.dev` / `password123`
- Member: `member@taskflow.dev` / `password123`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas project and a free cluster.
2. Create a database user with read/write permissions.
3. Add your IP address to Network Access, or use `0.0.0.0/0` for hosted deployment.
4. Copy the connection string and set it as `MONGO_URI`.
5. Use a database name such as `taskflow` in the connection string.

## API Documentation

All protected routes require `Authorization: Bearer <token>`.

### Auth

- `POST /api/auth/register` `{ name, email, password, role }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me`

### Projects

- `GET /api/projects`
- `POST /api/projects` `{ title, description }`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` `{ title, description }`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members` `{ email }`
- `DELETE /api/projects/:id/members/:userId`

### Tasks

- `GET /api/tasks?project=&status=&priority=&search=`
- `POST /api/tasks` `{ title, description, dueDate, priority, status, assignedTo, project }`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard

- `GET /api/dashboard/stats`

## Railway Deployment

1. Push this project to GitHub.
2. Create a new Railway project from the GitHub repository.
3. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=<your MongoDB Atlas URI>`
   - `JWT_SECRET=<long random string>`
   - `CLIENT_URL=<your Railway app URL>`
   - `VITE_API_URL=/api`
4. Set the build command:

```bash
npm run install:all && npm run build
```

5. Set the start command:

```bash
npm start
```

The backend serves `frontend/dist` in production.

## GitHub Push Steps

```bash
git init
git add .
git commit -m "Build TaskFlow team task management app"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

## Screenshots

Add screenshots of the landing page, dashboard, projects page, kanban board, and dark mode after deployment.
