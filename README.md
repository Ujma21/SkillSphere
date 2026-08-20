# SkillSphere — Intelligent Career Readiness & Placement Ecosystem

SkillSphere is a full-stack MERN application designed to help students prepare for placements through a unified Career Passport, readiness analysis, career roadmap, resume building, portfolio management, job applications, and placement tracking.

The platform also provides dedicated dashboards for recruiters and college administrators, creating a connected ecosystem between students, recruiters, and institutions.

---

## 🚀 Project Overview

Students often use multiple disconnected platforms to manage their skills, projects, certifications, resumes, job applications, and placement preparation.

SkillSphere brings these activities into a single platform.

Instead of functioning as only a job portal, SkillSphere focuses on **career readiness** by analyzing a student's existing profile and providing actionable guidance toward a selected career path.

The system supports three major user roles:

- **Student**
- **Recruiter**
- **College Administrator**

---

## 🎯 Objectives

- Create a centralized Career Passport for students.
- Measure career readiness using a rule-based readiness engine.
- Identify missing skills for a target career.
- Provide personalized career roadmaps.
- Track projects, certifications, DSA progress, internships, and achievements.
- Build professional resumes using existing Career Passport data.
- Generate recruiter-friendly public portfolios.
- Connect students with recruiter-posted jobs.
- Track the complete application journey.
- Provide recruiters with readiness-ranked candidates.
- Provide college administrators with placement and readiness analytics.

---

## ✨ Key Features

### 👨‍🎓 Student Features

#### Career Passport

Students can maintain a centralized professional profile containing:

- Personal and academic information
- College and degree
- Graduation year
- Target career
- Technical skills
- Projects
- Certifications
- GitHub profile
- LinkedIn profile
- DSA problem-solving count

---

### 📊 Career Readiness Engine

SkillSphere calculates a rule-based career readiness score based on multiple factors, including:

- Profile completion
- Target-role skill coverage
- Projects
- DSA progress
- Certifications
- GitHub presence
- LinkedIn presence

Supported career paths currently include:

- Java Backend Developer
- Frontend Developer
- Full Stack Developer

The system provides:

- Overall readiness score
- Score breakdown
- Missing skills
- Recommended next action
- Career roadmap

> The current readiness engine is rule-based and does not depend on an external AI service.

---

### 🧭 Career Journey Timeline

Students can record important milestones such as:

- Skills
- Projects
- Certifications
- Internships
- Interviews
- Achievements

This creates a chronological view of their career development.

---

### 💼 Job Portal

Students can:

- Browse open jobs
- View job details
- Apply to jobs
- Track application status

Recruiters can:

- Create jobs
- Open/close job postings
- View applicants
- Update application status

Application statuses include:

- Applied
- Assessment
- Interview
- Offer
- Rejected

Duplicate applications for the same job are prevented.

---

### 📄 Resume Builder

Students can create a professional resume using information already available in their Career Passport.

The resume can include:

- Professional summary
- Education
- Skills
- Projects
- Certifications
- Internships/experience
- Achievements
- GitHub
- LinkedIn
- Target career

The resume supports browser-based printing to PDF without requiring a paid external service.

---

### 🌐 Dynamic Portfolio

Students receive a recruiter-friendly public portfolio.

Features include:

- Career profile
- Skills
- Projects
- Certifications
- Career readiness
- GitHub
- LinkedIn

Portfolio routes:

```text
/portfolio/:userId
