LogLens 🔍

AI-Powered Error Debugging & Code Insight Platform

LogLens is a developer-focused debugging platform that analyzes runtime errors and application logs, correlates them with your actual codebase, and generates actionable, file-specific fixes using Large Language Models (LLMs).

Instead of generic error explanations, LogLens understands:

Your logs

Your repository code

The exact files and lines involved

and produces structured debugging reports with suggested fixes, diffs, and validation signals.

🚀 What Problem Does LogLens Solve?

When production or local errors occur, developers usually:

Copy logs

Search StackOverflow

Manually inspect multiple files

Guess root causes

This process is slow and error-prone.

LogLens automates this entire workflow by:

Accepting raw error logs

Mapping errors to relevant source files

Analyzing repository code context

Generating precise, explainable fixes

🧠 How LogLens Works
1. Project & Repository Setup

Users create a project and link a GitHub repository

A webhook indexes repository files into a searchable memory store

2. Log Ingestion

Developers submit raw runtime logs (Node.js, JS errors, etc.)

Logs are parsed to extract:

Error type

Message

File paths & line numbers

Severity

3. Code Context Matching

LogLens finds matching source files from the repository

Relevant code snippets are attached to the analysis

4. AI Debug Analysis

Using an LLM (Gemini):

Root cause is identified

A file-specific fix is generated

Optional diff-style suggestions are included

Confidence and validation status are calculated

5. Structured Debug Report

Each analysis produces:

Error summary

Root cause explanation

Fix suggestion

PR checklist

Confidence score

Validation status (verified / partial / conceptual)

📦 Key Features

🔗 GitHub repository integration (via webhooks)

🧠 AI-powered debugging with real code context

📁 File-level error matching

🧾 Structured, JSON-based analysis output

🕒 Full analysis history per project

🧪 Validation layer to assess fix reliability

📊 Confidence scoring

🔐 JWT-based authentication

🏗 Tech Stack
Backend

Node.js

Express

MongoDB (Mongoose)

JWT Authentication

GitHub Webhooks

Google Gemini LLM

Frontend

React

TypeScript

Tailwind CSS

TanStack Query

ShadCN UI

📂 Core Domain Models

Project – Logical workspace linked to a repo

Repo – GitHub repository metadata & indexing state

LogEvent – Raw logs submitted by users

CodeChunk – Indexed repository code snippets

Analysis – AI-generated debugging report

🔁 API Flow (High Level)
Create Project
   ↓
Link GitHub Repo
   ↓
Webhook Indexes Code
   ↓
Submit Logs
   ↓
Run Analysis
   ↓
View Debug Report

⚠️ Current Scope & Limitations

Designed for Node.js / JavaScript projects

Repository indexing is synchronous (can be async later)

Large repositories may require batching (future enhancement)

AI suggestions may be conceptual if code context is insufficient

🧭 Future Enhancements

Background workers for large repo indexing

Diff-based patch application

Multi-language support

CI/CD integration

Cost-aware LLM context control

One-click PR generation

🎯 Who Is This For?

Backend developers

Full-stack engineers

Students learning debugging

Teams wanting faster root-cause analysis

Anyone tired of chasing stack traces manually




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