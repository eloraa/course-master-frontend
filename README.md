# Course Master - Student Learning Platform

A modern student learning platform built with Next.js 16, featuring course browsing, enrollment, lesson management, quizzes, assignments, and an admin dashboard for course management.

## 🚀 Features

### Student Portal
- **Course Discovery**: Browse and enroll in courses with pagination
- **Dashboard**: View enrolled courses with progress tracking
- **Learning Interface**: Navigate through modules and lessons
- **Lesson Types**: Support for videos, articles, quizzes, and assignments
- **Quiz System**: Interactive quizzes with real-time submission
- **Assignment System**: Submit assignments with rich markdown support
- **Grade Tracking**: View submission status, grades, and instructor feedback

### Admin Portal
- **Course Management**: Create, edit, and publish courses
- **Module & Lesson Management**: Organize content with flexible lesson types
- **Quiz & Assignment Creation**: Create assessments with rich text support
- **Student Grading**: Grade submissions and provide markdown feedback
- **Submission Management**: Review and grade student submissions in a table format

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eloraa/course-master-frontend
   cd course-master-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env` file from the example and configure your values

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the result.

## 📋 Environment Variables

Create a `.env` file in the root directory with the following variables:

### API Configuration
```env
# API endpoints
API_URL=http://localhost:8080/v1
NEXT_PUBLIC_API_URL=http://localhost:8080/v1

# Full API URL (for raw API calls)
RAW_API_URL=http://localhost:8080

# Frontend application URL
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Authentication (NextAuth.js)
```env
# NextAuth.js configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Notes
- Replace `your-secret-key-here` with a randomly generated secret string
- Make sure the API server is running on `http://localhost:8080` or update the URLs accordingly
- The application requires both frontend (localhost:3000) and backend (localhost:8080) to be running

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants

### State Management & Data
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Rich Text & Markdown
- **React Markdown** - Markdown renderer
- **@uiw/react-md-editor** - Markdown editor
- **react-simple-code-editor** - Code editor
- **PrismJS** - Syntax highlighting

### Additional Libraries
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Date-fns** - Date manipulation
- **React Day Picker** - Date picker

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   ├── (public)/               # Public pages (homepage, course listing)
│   ├── (student)/              # Student dashboard and learning interface
│   └── (admin-dashboard)/      # Admin dashboard
├── components/                  # Reusable UI components
│   ├── markdown/              # Markdown editor and preview
│   ├── ui/                    # Shadcn/ui components
│   └── data-table/            # Data table components
├── data/                      # API hooks and data layer
│   ├── admin/                 # Admin-specific data hooks
│   ├── public/                # Public-facing data hooks
│   └── student/               # Student-facing data hooks
└── lib/                       # Utilities and configurations
```

## 📊 Key Features Implementation

### Student Features
- **Course Enrollment**: Join courses and track progress
- **Lesson Navigation**: Complete lessons with visual indicators
- **Quiz System**: Answer questions with visual feedback
- **Assignment Submission**: Write answers using rich markdown editor
- **Grade Tracking**: View submission status and instructor feedback

### Admin Features
- **Course Management**: Create and manage courses
- **Content Creation**: Add lessons, quizzes, and assignments
- **Grading Interface**: Review and grade student submissions
- **Rich Text Feedback**: Provide formatted feedback to students

## 🎯 Getting Started

1. **Start the backend API** (make sure it's running on port 8080)
2. **Install frontend dependencies**: `npm install`
3. **Configure environment variables** in `.env`
4. **Run development server**: `npm run dev`
5. **Access the application** at http://localhost:3000

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📝 Notes

- This is a frontend-only application and requires a backend API server
- The application uses NextAuth.js for authentication (not fully implemented in this frontend)
- All API calls are configured to work with a localhost:8080 backend
- Markdown content is rendered using React Markdown with custom components
- The admin dashboard provides comprehensive course management features