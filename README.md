<p align="center">
  <img src="https://files.catbox.moe/7pl10a.jpg" alt="KuRuMi-V3 Banner" width="100%">
</p>

<h1 align="center">🐱 KuRuMi-V3</h1>

<p align="center">
  <b>Advanced Facebook / Messenger Bot with Dashboard, Automation & AI</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-3.x-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Node.js-20x-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/EpicDanger198/KuRuMi-V3?style=social">
  <img src="https://img.shields.io/github/forks/EpicDanger198/KuRuMi-V3?style=social">
  <img src="https://img.shields.io/github/watchers/EpicDanger198/KuRuMi-V3?style=social">
</p>

---

## 🚀 Overview

**KuRuMi-V3** একটি powerful Messenger bot system যা automation, AI commands, live dashboard এবং advanced control system প্রদান করে।

> 👨‍💻 Author: **NiSaN**  
> ⚡ Version: **3.x**  
> 📜 License: **MIT**

---

## ✨ Core Features

- ⚡ Real-time CPU, RAM, uptime monitoring  
- 🤖 AI powered command system  
- 🔄 Auto restart & smart session handling  
- 📊 Live dashboard with logs  
- 🔐 Role-based secure command access  
- 🔁 Instant config reload system  
- 📧 Gmail OAuth2 email alerts  

---

## 🧩 Access Control (Roles)

| Role | Access Level       |
|------|--------------------|
| 4    | Premium Users      |
| 3    | Developers         |
| 2    | Admins             |
| 1    | GroupAdministration|
| 0    | Public Users       |

> 🔐 Higher role = more power

---

## ⚙️ Restricted Commands

| Command   | Role | Function |
|----------|------|----------|
| blanche  | R    | AI Execution |
| themeAI  | R    | Theme AI System |

---

## 📁 Project Structure

*KuRuMi-V3*/ 
│ 
├── public/                 # Frontend (dashboard UI, login, logs) 
├── bot/                    # Core bot system & commands 
│ 
├── config.json             # Main configuration file 
├── configCommands.json     # Command permissions & settings 
├── account.txt             # Session / account data 
│ 
├── Goat.js                 # Bot runtime process 
├── index.js                # API server + dashboard backend 
│ 
└── logger/ 
└── log.js              # Logging system |
---

## ⚡ Quick Setup

### 📦 Install Dependencies
```bash
npm install
```
## ▶️ Start Bot
```bash
node index.js
```
## 🔐 Dashboard Access
> Username: admin
> Password: admin123

---

## 🚀 Deployment Guide

---
### 🔷 Railway
Upload repo to GitHub
Login to Railway
Create New Project → Deploy from GitHub
Select repository
*Start Command*:
```bash
node index.js
```

---
## 🔶 Render
Login to Render
Create New Web Service
Connect GitHub repository
## Build Command:
```bash
npm install
```
*Start Command*:
```bash
node index.js
```

---
## 🧠 System Requirements
✅ Node.js 20x
✅ Stable internet connection
⚠️ Proper config.json setup required
❌ Invalid account.txt will prevent startup
## 📊 Project Highlights
⚙️ Fully customizable
🔐 Secure role system
📡 Real-time monitoring
🤖 AI integration ready
🌐 Dashboard controlled
## ⭐ Support & Contribution
If you like this project:
⭐ Star the repository
🍴 Fork & customize
🛠️ Contribute improvements
## 📜 License
This project is licensed under the MIT License.
�
> *Made with ❤️ by NiSaN*
---
