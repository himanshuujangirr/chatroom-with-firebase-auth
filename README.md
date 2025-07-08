# chatroom-with-firebase-auth
Firebase-based secure chatroom featuring user-specific login with Firestore Q&amp;A validation, real-time messaging, active user status, and timestamped conversations.



# 🔐 Firebase Chatroom with Firestore-Based Login

A simple yet functional real-time chatroom built using **Firebase**, **HTML/CSS/JavaScript**, and **Firestore** for login validation. This project demonstrates core Firebase features including user-specific login flow, live message syncing, active user status, and timestamped conversation tracking.

---

## 🚀 Features

- 🔑 **User-Specific Login**  
  - Two predefined users: **Himanshu** and **Pragati**  
  - Login via profile click & answering a user-specific security question from Firestore

- 🗂️ **Firestore Q&A Validation**  
  - Each user has a corresponding question-answer pair stored in Firestore  
  - Only correct input grants access to the chatroom

- 💬 **Real-Time Messaging**  
  - Messages are synced instantly between both users  
  - Firebase Firestore handles backend message storage

- 🕒 **Timestamps**  
  - Each message is stored and displayed with the exact send time

- 🟢 **Active Status Indicator**  
  - Displays whether the other user is online or inactive  
  - Presence is tracked using Firestore fields or updates

- 🖼️ **Custom UI with Avatars & Icons**  
  - Modern interface with profile images and chat icons  
  - Responsive layout with message input, send button, and feedback

---

## 🧰 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (modular ES6)
- **Backend (BaaS)**: Firebase  
  - Firestore Database  
  - Firebase Authentication (predefined users via Q&A)

---

## 🔧 Folder Structure
```
mychatroom/
├── index.html # Login screen
├── style.css # Login UI styling
├── lib/firebase.js # Firebase config & connection
├── pages/index.js # Login logic & validation
├── chatroom/
│ ├── chatroom.html # Main chat UI after login
│ ├── chatroom.js # Message handling + Firestore logic
│ ├── chatroom.css # Chatroom styles
│ ├── himanshu.jpg # User avatar
│ ├── pragati.jpg # User avatar
│ ├── camera.png, send.png, etc. # UI icons
├── himanshu.jpg / pragati.jpg


```

---

## 🧪 Firestore Setup

### 🔸 Collection: `security_questions`

| Document ID | question                        | answer     |
|-------------|----------------------------------|------------|
| himanshu    | Who do you trust the most?      | pragati    |
| pragati     | Who do you trust the most?      | himanshu   |

### 🔸 Collection: `messages`

| Field         | Type        | Description                    |
|---------------|-------------|--------------------------------|
| text          | string      | Message content                |
| sender        | string      | "himanshu" or "pragati"        |
| timestamp     | timestamp   | Message sent time              |

### 🔸 Collection: `status`

| Document ID | isActive | lastSeen     |
|-------------|----------|--------------|
| himanshu    | true     | 2025-07-07T… |
| pragati     | false    | 2025-07-07T… |

---

## 🎯 Purpose

This project was created to demonstrate:
- Firebase integration from scratch
- Real-time communication using Firestore
- User logic + minimal frontend design
- Used as a side project while applying for **Business Analyst** internships to showcase technical understanding & system design

---

## 🔗 Live Preview (optional)

> _You can add a GitHub Pages or Firebase Hosting link here if hosted_

---

## 👤 Author

**Himanshu Jangir**  
[LinkedIn](https://www.linkedin.com/in/himanshuujangirr/)  
Email: honnyjangir@gmail.com

---

## 📝 Note

This is a learning/demo project — not production-hardened.  
It is intentionally kept simple to highlight Firebase usage in a clear and understandable way.

