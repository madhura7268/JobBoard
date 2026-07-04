# 💼 Job Board Platform

A simple Job Board Platform built using **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. The application allows employers to post job listings, candidates to browse and apply for jobs, and users to track their submitted applications through a simple dashboard.

---

## 📌 Features

- Create and manage job listings
- Browse available jobs
- Apply for jobs
- View applications by candidate email
- Prevent duplicate job applications
- Dashboard with basic statistics
- Responsive single-page interface
- RESTful API built with Express.js

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

---

## 📂 Project Structure

```
JobBoard/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── public/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Features Overview

### Employer
- Add new job postings
- View all posted jobs

### Candidate
- Browse available jobs
- Apply for jobs
- Prevent duplicate applications
- View submitted applications

### Dashboard
- Total Jobs
- Total Employers
- Total Applications

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/madhura7268/JobBoard.git
```

Navigate to the project folder

```bash
cd JobBoard
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev --name init
```

Start the development server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### Employers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/employers` | Create a new employer |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | Get all job listings |
| POST | `/jobs` | Create a new job |

### Candidates

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/candidates` | Create a candidate |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/applications` | Apply for a job |
| GET | `/applications/:email` | View applications by candidate email |

---

## 💡 Highlights

- Built with TypeScript for better code quality
- Uses Prisma ORM for database management
- Clean REST API architecture
- Simple and responsive user interface
- Organized project structure
- Duplicate application prevention
- Beginner-friendly implementation

---

## 🔮 Future Improvements

- User authentication
- Employer login
- Resume upload support
- Job search and filters
- Application status updates
- Admin dashboard
- Pagination for job listings

---

## 👩‍💻 Author

**Madhura Bhaskare**

GitHub: https://github.com/madhura7268

---

## 📄 License

This project was developed for learning and internship purposes.
