# StudyMate - Your Personal Learning Companion 🎓

StudyMate is a comprehensive, modern learning management platform designed to help students organize their educational journey through personalized roadmaps, course tracking, and task management. Built with the latest web technologies, it provides a seamless and interactive experience for learners to achieve their goals.

---

[Live Demo](https://studymate-phi-ten.vercel.app/)

## 🚀 Features

- Personalized Roadmaps: Visualize your learning path with interactive roadmaps tailored to your goals.
- Course Management: Track your progress through various courses and lessons.
- XP & Progress System: Stay motivated with a gamified experience, earning XP as you complete lessons.
- Smart Task List: Organize your daily study tasks and stay on top of your schedule.
- Responsive Dashboard: A beautiful, user-centric dashboard providing a quick overview of your learning status.
- Secure Authentication: Complete auth system integrated with Supabase, including email verification and password recovery.
- Professional Profile: Manage your personal information and showcase your achievements.

---

## 🛠 Tech Stack

- Framework: [Next.js 16](https://nextjs.org/) (App Router)
- Language: [TypeScript](https://www.typescriptlang.org/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- UI Components: [Material UI (MUI)](https://mui.com/) & [Lucide React](https://lucide.dev/)
- Database & Auth: [Supabase](https://supabase.com/)
- State Management: [Redux Toolkit](https://redux-toolkit.js.org/)
- Animations: [Framer Motion](https://www.framer.com/motion/)
- Notifications: [React Hot Toast](https://react-hot-toast.com/)

---

## 📂 Project Structure

src/
├── actions/          # Server Actions (Server-side mutations)
├── app/              # Next.js App Router (Pages & API)
│   ├── (auth)/       # Authentication flows (Login, Signup, etc.)
│   └── (student)/    # Student-facing features (Dashboard, Roadmaps, etc.)
│   
├── components/       # Reusable UI components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Shared libraries and configs (Supabase, etc.)
├── services/         # External API services logic
├── store/            # Redux state management (Slices & Store)
├── types/            # TypeScript definitions & Interfaces
└── utils/            # Helper functions & Logic

---

## ⚙️ Installation

To get started with StudyMate locally, follow these steps:

1. Clone the repository:
      git clone <repository-url>
   cd final-project
   

2. Install dependencies:
      npm install
   

3. Set up Environment Variables:
   Create a .env.local file in the root directory and add your Supabase credentials:
# ===== Supabase =====
NEXT_PUBLIC_SUPABASE_URL=****************
NEXT_PUBLIC_SUPABASE_ANON_KEY=****************

# ONLY FOR SERVER-SIDE 
SUPABASE_SERVICE_ROLE_KEY=****************


# ===== Google OAuth =====
AUTH_GOOGLE_ID=****************
AUTH_GOOGLE_SECRET=****************


# ===== App Config =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
   

4. Run the development server:
      npm run dev
   

5. Open the app:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Meet the Team

This project was developed with passion and dedication by:

- Reham Al-Magharee 
- Basma Kuhail - 
- Ashraf Al-Kahlout - 

---

## 📄 License

This project is part of a final graduation project. All rights reserved © 2025.