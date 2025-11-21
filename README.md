# 🧠 AI Image Analysis & Q&A Platform

## 📄 Project Overview
This is a **Full-Stack AI Application** designed to perform real-time object detection on uploaded images and allow users to ask conversational questions about the results.

The system uses a local **YOLOv8** model for detection (running inside Docker) and integrates with **Google Gemini AI** to provide intelligent, context-aware responses about the detected objects.

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js (React)
- **Styling:** CSS Modules (Responsive Design)
- **Features:** Drag-and-drop upload, Interactive Chat UI, Sortable Results Table.

### **Backend**
- **Framework:** Django Rest Framework (Python 5.2.8)
- **Object Detection:** Ultralytics YOLOv8 (Runs locally on CPU).
- **Generative AI:** Google Gemini 1.5 Flash / Pro (with smart fallback logic).
- **Authentication:** JWT (JSON Web Tokens) via `simplejwt`.
- **Database:** SQLite (Containerized & Auto-Migrated).

### **DevOps**
- **Containerization:** Docker & Docker Compose.
- **Optimization:** Custom Dockerfile with system-level dependencies (`libGL`) for OpenCV stability.

---

## ✨ Key Features

1.  **Secure Authentication:**
    * User Signup & Login with password validation.
    * Protected routes using JWT Access/Refresh tokens.

2.  **Object Detection Pipeline:**
    * Users upload an image -> Backend processes it with YOLOv8.
    * Returns an **Annotated Image** (bounding boxes drawn) and structured **JSON data**.
    * **Modern Stack:** Utilizes the latest Python libraries including `numpy 2.2.6` and `opencv-python 4.12`.

3.  **Interactive Results Table:**
    * Displays detected objects, confidence scores, and coordinates.
    * **Sortable:** Click column headers to sort by Class or Confidence.

4.  **AI-Powered Q&A Chat:**
    * Users can ask questions like *"What is in this image?"* or *"How many cars are there?"*.
    * **Smart Hybrid Mode:** The system attempts to call **Gemini 1.5 Flash** or **Pro**. If the API Key fails or network is down, it seamlessly switches to a **Smart Local Analysis** mode, ensuring the chat *always* provides a relevant answer based on detection data.

---

## 🚀 Installation & Setup Guide (Step-by-Step)

### Prerequisites
* **Docker Desktop** installed and running.

---

### 📥 Method 1: Download as ZIP (Easiest)
If you do not want to use Git commands, follow these steps:

1.  Click the green **Code** button at the top of this GitHub page.
2.  Select **Download ZIP**.
3.  **Extract (Unzip)** the downloaded file to a folder on your computer.
4.  Open that folder in **VS Code** or your terminal.

---

### 💻 Method 2: Git Clone (Standard)
If you prefer using Git, run this command in your terminal:

```bash
git clone [https://github.com/NihalSWE/AI-Image-Analysis-Q-A-Platform.git](https://github.com/NihalSWE/AI-Image-Analysis-Q-A-Platform.git)
cd AI-Image-Analysis-Q-A-Platform

🏃‍♂️ How to Run the Project
Once you have the project folder open in your terminal (PowerShell, CMD, or Terminal), run this single command to build and start the application.

Copy and paste this command:

Bash

docker compose up --build
Note: Please wait a few minutes for the initial build. Docker will download the Python dependencies and AI models automatically.

🌐 Access the Application
Once the terminal says "Listening at https://www.google.com/search?q=http://0.0.0.0:8000", open your browser and go to:

Frontend UI: http://localhost:3000

Backend API: http://localhost:8000

📂 Project Structure
├── ai_image_app/        # Django Backend
│   ├── vision/          # Object Detection Logic (YOLO)
│   ├── users/           # Auth Logic (JWT)
│   ├── qa/              # AI Chat Logic (Gemini + Fallback)
│   ├── requirements.txt # Python Dependencies
│   └── Dockerfile       # Backend Container Config
├── frontend/            # Next.js Frontend
│   ├── app/             # Pages (Dashboard, Auth)
│   ├── components/      # UI Components
│   └── Dockerfile       # Frontend Container Config
└── docker-compose.yml   # Orchestration for Frontend + Backend

