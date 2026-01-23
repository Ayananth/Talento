#  Talento – Job Portal Application

**Talento** is a full-stack **job portal platform** that connects **job seekers** and **recruiters** through a modern, scalable web application.  
Job seekers can search, filter, and apply for jobs, while recruiters can post jobs, manage applications, and track hiring activity.

This project is built using Django REST Framework and React.

---

## ✨ Key Features

### 👤 Job Seeker
- User registration & authentication
- Search and filter jobs
- Apply for jobs
- Track applied jobs
- Save/bookmark jobs
- Real-time notifications (WebSockets)

### 🧑‍💼 Recruiter
- Recruiter profile management
- Post, edit, and delete job listings
- View and manage job applications
- Shortlist / reject candidates
- Recruiter dashboard

### 🛠️ Admin
- User & recruiter management
- Job moderation
- Transactions & reports

---

## 🏗️ Tech Stack

### 🔙 Backend
- Python
- Django
- Django REST Framework
- Django Channels
- WebSockets
- PostgreSQL
- PostgreSQL Full-Text Search

### 🎨 Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Flowbite

---

## 🧠 Architecture Overview

- REST API–based backend
- Role-based authentication (Job Seeker / Recruiter / Admin)
- Decoupled frontend & backend
- WebSocket-based real-time notifications
- Scalable PostgreSQL database design
