
# 🧠 Talk2Task

**Talk2Task** is an AI-powered meeting transcript summarization app that transforms long meeting transcripts into **crisp summaries**, **clear action items with deadlines**, and **key decisions** — using Google's **Gemini API**.

Built with a **monorepo** architecture, this project includes:

* A **React + Tailwind** frontend (`client/`)
* An **Express.js** backend (`server/`)
* Connected via **PostgreSQL** and **Prisma ORM**

---

## 🚀 Features

* ✅ **User Authentication**

  * Register/Login with email & password
  * JWT-based authentication
* 🧠 **AI-Powered Summarization**

  * Uses **Gemini 1.5 Flash API** (Google AI Studio)
  * Parses and processes `.txt`, `.pdf`, `.docx` files or plain text
* 💾 **History of Summaries**

  * Stores all past summaries per user
  * Users can **delete** or **save** summaries
* 🛡️ **Rate Limiting**

  * Prevents abuse of the Gemini API
  * 10 summarization requests/user per hour
* 🧪 **Integration Tests**

  * Powered by `Jest` and `Supertest`
* 🎨 **Responsive UI**

  * Built using **shadcn/ui** and **Tailwind CSS**
  * Fully mobile and desktop compatible

---

## 🧱 Tech Stack

| Layer       | Technology                                         |
| ----------- | -------------------------------------------------- |
| Frontend    | React + TypeScript + Vite                          |
| Styling     | Tailwind CSS + shadcn/ui                           |
| File Upload | react-dropzone + pdfjs-dist + mammoth              |
| Backend     | Node.js + Express.js                               |
| AI API      | Google Generative AI (Gemini 1.5)                  |
| Database    | PostgreSQL (Hosted on [NeonDB](https://neon.tech)) |
| ORM         | Prisma                                             |
| Auth        | JWT + bcryptjs                                     |
| Tests       | Jest + Supertest                                   |
| Deployment  | Frontend - Vercel, Backend - Render                |

---

## 🔐 Authentication

* Users register/login using email and password
* Passwords are hashed using `bcryptjs`
* JWT tokens are stored in localStorage and sent in the `Authorization` header

---

## 🧠 AI Integration (Gemini)

* Gemini 1.5 Flash model is used to summarize transcripts
* Prompt includes:

  * Summary in bullet points
  * Action Items (with assignee and date)
  * Key Decisions
* Deadlines like “next Monday” or “by Friday” are **converted to actual dates** intelligently by the prompt

---

## 🧪 Integration Testing

Tests for `/api/summarize` endpoint:

* ✅ No token → `401 Unauthorized`
* ✅ Invalid token → `403 Forbidden`
* ✅ Valid token & transcript → Returns mocked Gemini result
* ✅ Missing transcript → `400 Bad Request`

Test stack:

* `Jest` for unit/integration tests
* `Supertest` for HTTP request testing
* Gemini API is mocked during tests

---

## 💻 Local Development

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/talk2task.git
cd talk2task
```

Install client & server deps:

```bash
cd client
npm install
cd ../server
npm install
```

---

### 2. Environment Variables

#### `server/.env`

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://your_user:your_pass@your_neon_host/db
GEMINI_API_KEY=your_google_ai_studio_key
```

---

### 3. Setup Database

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

---

### 4. Run App

**Backend:**

```bash
cd server
npm run dev
```

**Frontend:**

```bash
cd client
npm run dev
```

---

## ☁️ Deployment

### Frontend

* Deployed to **Vercel**
* Vite + React app

### Backend

* Deployed to **Render**
* Express server with CORS configured for frontend origin

---

## 🧠 Future Improvements

* Add OAuth (Google login)
* Export summaries as PDF
* User profile settings
* GPT-4 or Gemini Pro upgrade
* Admin analytics dashboard

---

## 📸 Screenshots

![{D6F466E2-8144-47B8-88A1-692E4439FE39}](https://github.com/user-attachments/assets/e509be54-6779-40d0-a953-a552f8c218cd)
Summary History Page
![{4AAA9D77-90CA-4701-B939-4A95B671754C}](https://github.com/user-attachments/assets/e557f44b-162c-4f7e-95ba-eec913ff92d8)



---

## 📄 License

MIT License © 2025 \Saransh

