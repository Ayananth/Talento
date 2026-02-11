# Talento – AI-Powered Job Portal Application

Talento is a full-stack AI-powered job portal application where job seekers can discover and apply for jobs, and recruiters can post jobs and manage candidates efficiently using the power of AI.

The platform integrates intelligent features like semantic job matching, resume parsing, and AI-driven insights to improve the hiring experience for both candidates and recruiters.

---

## 🚀 Features

### 👤 Job Seeker
- User registration & authentication  
- Profile management  
- Resume upload  
- AI-based resume parsing  
- Semantic job search  
- Similarity-based job matching  
- Apply to jobs  
- Track applications  

### 🏢 Recruiter
- Recruiter registration & authentication  
- Post and manage job listings  
- View applicants  
- Candidate filtering  

### 🤖 AI Capabilities
- Resume content extraction using LLMs  
- Resume summarization  
- Embedding-based similarity search  
- Vector database integration for semantic matching  

---

## 🛠️ Tech Stack

### Backend
- Python  
- Django  
- Django REST Framework  
- PostgreSQL  
- Vector Database (for embeddings & semantic search)  
- Docker  

### Frontend
- React  
- Vite  
- Axios  

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- Docker & Docker Compose  
- Node.js (v18+)  
- npm  

---

## 🐳 Backend Setup

From the project root directory:

```bash
sudo docker compose up --build
```

This will:
- Build the backend service  
- Start PostgreSQL  
- Run migrations  
- Start the Django server  

Backend will run at:

```
http://localhost:8003
```

---

## 💻 Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Then visit the URL shown in the terminal:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory with:

```env
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_key
```

## 🧠 Future Enhancements

- AI-powered resume tailoring  
- Automated job application workflows  
- Interview preparation assistant
- Video call interview

---

## 👨‍💻 Author

**Ayananth**  
Python & AI Developer
