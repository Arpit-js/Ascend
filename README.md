# Ascend: Career Development Platform

## Project Overview
**Ascend** is a web application designed to help users manage and accelerate their career development. It enables users to track their skills, set career goals, and receive personalized recommendations for improvement.  

The platform's standout feature is **Skill Gap Analysis**, which compares a user's current skills with the skills required for a target role and provides AI-powered learning recommendations to bridge the gap.

---

## Project Architecture
The project follows a modern web architecture, with clear separation between frontend and backend:

**Frontend**  
- Built as a Single Page Application (SPA) using **React**.  
- Uses **React Router** for navigation and **CSS Modules** for styling.  
- Manages user session and state using React Context API.

**Backend**  
- Powered by **Supabase** (Backend-as-a-Service).  
- Components:  
  - **Database**: PostgreSQL database storing users, skills, roles, and career paths.  
  - **Authentication**: Handles user signup, login, and password recovery.  
  - **Storage**: Stores user avatars.  
  - **Serverless Functions (Deno)**: Generates AI-powered learning recommendations.

---

## Users in the Project
Currently, the platform supports one main user type: **Employee / End User**.  

**Capabilities:**  
- Create and manage user profiles.  
- Add skills, experience, and career goals.  
- View predefined career paths and required skills.  
- Select a target role to perform skill gap analysis.  
- Receive AI-powered learning recommendations for missing skills.

---

## Database Details
The platform uses a **PostgreSQL database** managed by Supabase. Key tables include:  

| Table Name     | Purpose |
|----------------|---------|
| `users`        | Stores user profiles (name, title, department, experience, career goals). Links with Supabase `auth.users` table via `id`. |
| `skills`       | List of all available skills in the system. |
| `user_skills`  | Maps users to the skills they possess. |
| `roles`        | List of all available job roles. |
| `role_skills`  | Maps roles to the skills required for each role. |
| `achievements` | Stores user achievements with title, description, and date. |

---

## Key Features
- **Profile Management**: Users create profiles with skills, experience, and goals.  
- **Career Paths**: Visualize career paths and the skills required for each role.  
- **Skill Gap Analysis**: Highlights matching and missing skills relative to a target role.  
- **AI Recommendations**: Generates personalized learning suggestions for missing skills using OpenAI.

---

## How Skill Gap Analysis Works
1. User selects a target role.  
2. Frontend fetches required skills for that role from the database.  
3. Compares with the user’s existing skills to determine **Matching** vs **Missing Skills**.  
4. Sends missing skills to a serverless function.  
5. Serverless function calls OpenAI API with a prompt to generate learning recommendations.  
6. Recommendations are displayed to the user.

---

## Technical Stack
- **Frontend**: React, React Router, CSS Modules  
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Serverless Functions with Deno)  
- **AI Integration**: OpenAI API for personalized learning recommendations

---

## Future Scope & Improvements
- **Admin Panel**: Manage skills, roles, and career paths.  
- **Social Features**: Connect with mentors or colleagues.  
- **Gamification**: Points, badges, or leaderboards to boost engagement.  
- **Learning Platform Integration**: Direct links to courses on Coursera, Udemy, etc.

---

## Current Issues & Challenges
- **Scalability of AI Recommendations**: High API usage can become slow/expensive.  
- **Data Maintenance**: Skills, roles, and career paths need manual updates.  
- **Limited User Roles**: Currently only supports end users; admin/mentor roles are missing.

---

## Past Challenges & Solutions
**Challenge 1:** Initial database modeling for efficient relationships between users, skills, roles, and career paths.  
**Solution:** Designed a normalized schema with join tables for flexibility.  

**Challenge 2:** Real-time AI recommendations without long loading times.  
**Solution:** API calls made asynchronous; loading indicators used; serverless function optimized for speed.  

**Challenge 3:** Managing React state efficiently.  
**Solution:** Utilized React Context API for session and profile management.

---

## Setup Instructions
1. **Clone the repository:**  
```bash
git clone <repo-url>
cd ascend
