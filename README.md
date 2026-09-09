# SideQuest

### Skill Exchange Platform

SideQuest is a full-stack web application that lets people exchange skills without exchanging money.

The idea is simple:

> **Teach What You Know. Learn What You Love.**

Users create profiles with the skills they can teach and the skills they want to learn. SideQuest helps them discover compatible people based on skills, proficiency, availability, language, and location.

---

## ✨ Features

### 🎯 Smart Skill Matching

Discover people whose skills complement your own and explore compatibility scores between users.

The matching system considers factors such as:

- Skills you can teach
- Skills you want to learn
- Skill proficiency
- Availability
- Location
- Spoken languages

---

### 🔄 Skill Exchange

Send skill-swap requests to other users and propose an exchange based on what you can teach and what you want to learn.

Users can:

- Browse potential matches
- View their skills
- View desired skills
- Send swap requests
- Accept or manage requests
- Track active exchanges

---

### 👤 User Profiles

Create a profile containing:

- Name
- Username
- Location
- Short bio
- Skills you can teach
- Skills you want to learn
- Skill proficiency levels
- Experience
- Availability
- Spoken languages
- Portfolio information

---

### 💬 Real-Time Chat

Communicate with other users through real-time messaging powered by Socket.io.

---

### 📅 Learning Sessions

Manage skill-exchange sessions and keep track of learning commitments.

---

### ⭐ Reviews & Ratings

Rate completed skill exchanges and build reputation within the SideQuest community.

---

### 🏆 Gamification

Users earn XP through participation and progress through different levels.

---

### 🔔 Notifications

Receive notifications for relevant account activity and skill-exchange interactions.

---

### 🌓 Light & Dark Mode

SideQuest provides both light and dark themes while maintaining the same overall visual identity.

---

## 🔄 How SideQuest Works

```text
Create Profile
      ↓
Add Skills You Can Teach
      ↓
Add Skills You Want to Learn
      ↓
Discover Compatible Users
      ↓
View Their Skills
      ↓
Send Skill Swap Request
      ↓
Accept the Exchange
      ↓
Chat & Schedule Sessions
      ↓
Teach + Learn
      ↓
Review & Earn XP
```

## 🏗️ Architecture
---
                         ┌──────────────────────┐
                         │        User          │
                         │      Browser         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Vercel         │
                         │   React Frontend     │
                         │   Vite + Tailwind    │
                         └──────────┬───────────┘
                                    │
                         REST API / Socket.io
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Render         │
                         │   Node + Express     │
                         │      Backend         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    MongoDB Atlas     │
                         │      Database        │
                         └──────────────────────┘


## 🛠️ Tech Stack

```
Frontend	            React.js, Vite, Tailwind CSS, React Router, Axios
UI & Icons	            Lucide React
State Management	      React Context API
Backend	            Node.js, Express.js
Authentication	      JSON Web Tokens (JWT), Bcrypt.js
Real-Time Communication	Socket.io
Database	            MongoDB Atlas, Mongoose
File/Image Handling	Multer, Cloudinary
Deployment	            Vercel, Render
