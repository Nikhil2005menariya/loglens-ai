## Prerequisites

Make sure you have:

- Node.js installed
- MongoDB running locally

---

## Backend Setup (Node + Express)

### 1) Go to backend folder

```bash
cd backend/loglens-backend


2) Install dependencies
npm install

3) Create .env file

Create a file named .env inside:

backend/loglens-backend/.env

4) Add this content in .env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/loglens
JWT_SECRET=loglens_super_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSyDo_1tlDY0P0expuhPI2zkvsGAPM1tfn5o
GITHUB_WEBHOOK_SECRET=loglens_secret_key

5) Run the backend server
npm run dev


Backend will run on:

http://localhost:5002

Frontend Setup (React + Vite)
1) Go to frontend folder
cd frontend

2) Install dependencies
npm install

3) Start frontend
npm run dev


Frontend will run on something like:

http://localhost:5173

Run Both (Recommended)

✅ Open 2 terminals:

Terminal 1 (Backend)

cd backend/loglens-backend
npm install
npm run dev


Terminal 2 (Frontend)

cd frontend
npm install
npm run dev