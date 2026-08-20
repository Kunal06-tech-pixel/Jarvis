# Jarvis: AI-Powered Voice Assistant & Productivity Suite

<img width="1919" height="936" alt="image" src="https://github.com/user-attachments/assets/0244dbcb-8ff5-40ad-84cf-2c3a6fc3b49e" />


**Jarvis** is a full-stack, production-ready AI personal task assistant built to demonstrate modern web engineering, agentic AI workflows, and real-time backend systems. Instead of a basic CRUD to-do app, Jarvis allows you to manage your life via natural language voice commands, automatically parsing intents, detecting scheduling conflicts, and emitting real-time notifications for background jobs.

## 🌟 Key Features

*   **🗣️ Voice-First AI Engine:** Powered by OpenAI's Whisper (for accurate Speech-to-Text) and Groq's `llama-3.1-70b-versatile` LLM (for blazing-fast intent parsing and tool calling). Just say, *"Remind me to call Mom tomorrow at 7 PM,"* and Jarvis handles the rest.
*   **⚡ Real-Time WebSockets:** Built-in Socket.IO integration ensures that when a background job triggers a reminder, a live toast notification instantly pops up on your screen.
*   **⚙️ Background Workers:** Utilizes Redis and BullMQ to run asynchronous polling tasks, scanning for due reminders and handling complex recurring patterns without blocking the main event loop.
*   **📊 Interactive Data Visualization:** The dashboard features beautiful Area Charts powered by Recharts, tracking your 7-day productivity and task completion trends directly from aggregated database metrics.
*   **🧠 Smart Conflict Detection:** The AI agent acts as a guardrail, automatically checking your calendar for overlapping events before scheduling new meetings.
*   **🔒 Secure & Scalable:** JWT-based authentication, bcrypt password hashing, and a strongly typed Prisma ORM connected to a PostgreSQL database.

## 🛠️ Technology Stack

**Frontend**
*   React 18 + Vite
*   TypeScript
*   Tailwind CSS + shadcn/ui
*   Zustand (Global State Management)
*   Recharts (Data Visualization)
*   Socket.IO Client

**Backend**
*   Node.js + Express
*   TypeScript
*   PostgreSQL (via Prisma ORM)
*   Redis + BullMQ (Background Jobs)
*   Socket.IO (Real-time events)
*   Groq API (LLM Tool Calling)
*   Zod (Schema Validation)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose (for PostgreSQL & Redis)
*   A Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/voice-assistant.git
   cd voice-assistant
   ```

2. **Start the Infrastructure (DB & Redis):**
   ```bash
   docker-compose up -d
   ```

3. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/voice_db?schema=public"
   JWT_SECRET="your_super_secret_jwt_key_here"
   GROQ_API_KEY="your_groq_api_key_here"
   REDIS_URL="redis://127.0.0.1:6379"
   ```
   Run database migrations and start the server:
   ```bash
   npx prisma migrate dev --name init
   npm run dev
   ```

4. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file in the `/client` directory:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

5. **Access the App:**
   Open your browser and navigate to `http://localhost:5173`. You can register a new account or use the seeded demo account if configured.

## 🧠 How the AI Works

The core of Jarvis is the `assistantController.ts`, which bridges the gap between natural language and database operations. 
1. The user's voice is transcribed into text using Whisper in the browser.
2. The text is sent to the backend and passed to the Groq LLM along with a strict set of **JSON Schema Tools** (e.g., `createTask`, `scheduleEvent`, `setReminder`).
3. The LLM acts as an autonomous agent, determining which tool to call based on the user's intent.
4. The backend intercepts the tool call, executes the corresponding Prisma database operation, and returns the result to the LLM to generate a natural language confirmation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/voice-assistant/issues).

## 📝 License

This project is licensed under the MIT License.
