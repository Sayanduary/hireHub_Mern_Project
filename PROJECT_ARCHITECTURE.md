# HIREHUB - Project Architecture Documentation

## 1. Executive Summary

**HIREHUB** is a full-stack MERN (MongoDB, Express, React, Node.js) job portal application with two distinct user roles: Students and Recruiters. The platform enables students to search for jobs, apply to positions, and track their applications, while recruiters can post job listings, manage applications, and build their company profiles.

---

## 2. System Overview

### Key Features
- **Authentication System**: JWT-based login/signup with Google OAuth 2.0 support and role-based access (Student/Recruiter)
- **Job Management**: Complete CRUD operations for job postings
- **Application System**: Apply, track, and manage job applications
- **Company Management**: Recruiters can create and manage company profiles
- **Profile Management**: Students can update profiles with resume, skills, and bio
- **File Uploads**: Resume uploads via Cloudinary
- **Responsive Design**: Full dark mode support with customizable theme
- **Saved Jobs**: Students can save jobs for later review
- **Application Status Tracking**: Recruiters can update application statuses (pending, accepted, rejected)
- **ATS Score Checker**: AI-powered resume analysis against job descriptions
- **AI Chatbot**: Workflow-driven conversational assistant for job browsing and applications
- **Resume Builder**: Professional resume builder with PDF export and cloud storage

### Technology Stack

**Frontend:**
- React 18.2 with Vite 5.2
- Redux Toolkit with Redux Persist for state management
- React Router v6.23 for navigation
- TailwindCSS 3.4 for styling
- Radix UI components library (avatar, dialog, popover, select, etc.)
- Framer Motion 11.3 for animations
- Axios for HTTP requests
- html2pdf.js & jspdf for PDF generation
- @react-oauth/google for Google authentication
- Sonner for toast notifications
- next-themes for dark mode
- Embla Carousel for carousels
- Lucide React for icons
- React Markdown for content rendering

**Backend:**
- Node.js with Express 4.19
- MongoDB with Mongoose 8.4 ODM
- JWT (jsonwebtoken 9.0) for authentication
- Passport.js with Google OAuth 2.0 strategy
- Bcryptjs 2.4 for password hashing
- Cloudinary 2.3 for file uploads
- Multer 1.4 for file handling
- Google Generative AI (Gemini 2.0 Flash) for AI features
- pdf-parse & mammoth for document parsing

---

## 3. Database Schema

### User Model
```javascript
{
  fullname: String (required),
  email: String (unique, required),
  phoneNumber: Number,
  password: String (hashed),
  googleId: String,                           // Google OAuth ID
  role: Enum ['student', 'recruiter'] (required),
  authProvider: Enum ['email', 'google'] (default: 'email'),
  
  profile: {
    bio: String,
    skills: [String],
    location: String,
    resume: String (URL),
    resumeOriginalName: String,
    company: ObjectId (ref: Company),
    profilePhoto: String (default: ""),
    linkedinUrl: String,
    githubUrl: String,
    // Recruiter-specific fields:
    designation: String,
    companyName: String,
    companyWebsite: String,
    companyEmail: String,
    companyLocation: String,
    companyDescription: String,
    yearsOfExperience: Number
  },
  
  notifications: [{
    message: String,
    type: Enum ['application_status', 'general'],
    jobId: ObjectId (ref: Job),
    applicationId: ObjectId (ref: Application),
    read: Boolean (default: false),
    createdAt: Date
  }],
  
  savedJobs: [ObjectId (ref: Job)],
  
  timestamps: true
}
```

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  requirements: [String],
  salary: Number (required),
  experienceLevel: Number (required),   // in years
  location: String (required),
  jobType: String (required),
  position: Number (required),           // number of openings
  
  company: ObjectId (ref: Company, required),
  created_by: ObjectId (ref: User, required),
  applications: [ObjectId (ref: Application)],
  
  timestamps: true
}
```

### Application Model
```javascript
{
  job: ObjectId (ref: Job, required),
  applicant: ObjectId (ref: User, required),
  status: Enum ['pending', 'accepted', 'rejected'] (default: 'pending'),
  
  timestamps: true
}
```

### Company Model
```javascript
{
  name: String (required),
  description: String,
  website: String,
  location: String,
  logo: String (Cloudinary URL),
  
  userId: ObjectId (ref: User, required),
  
  timestamps: true
}
// Compound unique index: { name: 1, userId: 1 }
```

### Resume Model
```javascript
{
  userId: ObjectId (ref: User, indexed, required),
  title: String (required),
  resumeData: Mixed Object (required),         // JSON resume data
  templateType: Enum ['ui', 'latex'] (default: 'ui'),
  pdfUrl: String (Cloudinary URL, required),
  pdfPublicId: String (Cloudinary public ID, required),
  
  timestamps: true
}
```

---

## 4. API Endpoints

### User Endpoints (`/api/v1/user`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | ❌ | Register new user with profile photo |
| POST | `/login` | ❌ | Login with email/password |
| GET | `/logout` | ❌ | Logout (clear token cookie) |
| GET | `/profile` | ✅ | Get current user profile |
| POST | `/profile/update` | ✅ | Update profile (supports file uploads) |
| POST | `/change-password` | ✅ | Change password |
| POST | `/set-password` | ✅ | Set password (for Google OAuth users) |
| POST | `/save-job/:id` | ✅ | Toggle save/unsave job |
| GET | `/saved-jobs` | ✅ | Get all saved jobs |
| GET | `/download-resume` | ✅ | Download user resume |
| GET | `/auth/google` | ❌ | Initiate Google OAuth |
| GET | `/auth/google/callback` | ❌ | Google OAuth callback |
| GET | `/auth/google/user` | ❌ | Get user data after Google auth |

### Job Endpoints (`/api/v1/job`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/post` | ✅ | Create new job (Recruiter only) |
| GET | `/get` | ❌ | Get all jobs (with keyword search) |
| GET | `/getadminjobs` | ✅ | Get jobs by logged-in recruiter |
| GET | `/:id` | ❌ | Get job details by ID |
| PUT | `/:id` | ✅ | Update job (Recruiter only) |

### Application Endpoints (`/api/v1/application`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/apply/:id` | ✅ | Apply for a job (Student) |
| GET | `/get` | ✅ | Get all applied jobs (Student) |
| DELETE | `/:id` | ✅ | Withdraw application (Student) |
| GET | `/:id/applicants` | ✅ | Get applicants for job (Recruiter) |
| POST | `/status/:id/update` | ✅ | Update application status (Recruiter) |

### Company Endpoints (`/api/v1/company`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | ✅ | Register new company |
| GET | `/get` | ✅ | Get all companies for user |
| GET | `/:id` | ✅ | Get company by ID |
| PUT | `/:id` | ✅ | Update company with logo |

### Resume Endpoints (`/api/v1/resume`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/preview` | ❌ | Preview resume (validate data) |
| POST | `/save` | ✅ | Save resume with PDF to Cloudinary |
| GET | `/` | ✅ | Get all user resumes |
| GET | `/:id` | ✅ | Get single resume |
| PUT | `/:id` | ✅ | Update resume |
| DELETE | `/:id` | ✅ | Delete resume |

### ATS Endpoints (`/api/v1/ats`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/check` | ❌ | Analyze resume against job description |

### Chatbot Endpoints (`/api/v1/chatbot`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/message` | Optional | Process chatbot message (guest or authenticated) |

---

## 5. Frontend Architecture

### Route Structure
```
Public Routes:
/                           - Home page (hero section, categories, latest jobs)
/jobs                       - Job listing with advanced filters
/description/:id            - Job details page with apply/save
/login                      - Login page (email + Google OAuth)
/signup                     - Signup page
/auth/google/callback       - Google OAuth callback handler
/about                      - About page
/ats-check                  - ATS resume score checker
/resume-builder             - Resume builder (create/edit resumes)

Protected Routes (Authenticated):
/profile                    - User profile (applied jobs, saved jobs, resumes)
/profile/edit               - Edit user profile

Admin Routes (Recruiter Only):
/admin/companies            - List all companies
/admin/companies/create     - Create new company
/admin/companies/:id        - Edit company details
/admin/jobs                 - Recruiter's job listings
/admin/jobs/create          - Post new job
/admin/jobs/:id             - Edit job posting
/admin/jobs/:id/applicants  - View/manage job applicants
```

### Redux Store Structure
```javascript
store (with redux-persist)
├── auth
│   ├── user                    // Current user object
│   ├── loading                 // Auth loading state
│   └── token                   // JWT token
├── job
│   ├── allJobs                 // All fetched jobs
│   ├── singleJob               // Currently viewed job
│   ├── searchJobByText         // Search text
│   ├── allAdminJobs            // Recruiter's jobs
│   └── filters                 // Job filters
│       ├── location, industry, jobType, experience
│       ├── salary, salaryRange: { min, max }
│       ├── skills: []
│       └── searchText
├── company
│   ├── singleCompany           // Currently viewed company
│   ├── companies               // All companies
│   └── searchCompanyByText     // Search text
├── application
│   ├── applicants              // Job applicants (for recruiters)
│   └── allAppliedJobs          // User's applied jobs
├── resume
│   ├── resumes                 // All saved resumes
│   ├── currentResume           // Resume data for editing
│   ├── currentResumeId         // ID for update vs create
│   ├── loading                 // Loading state
│   └── error                   // Error state
└── savedJob
    ├── savedJobs               // Saved job IDs
    └── savedJobsData           // Full saved job data
```

### Key Components

**Global Components:**
- `Navbar` - Global navigation with theme toggle, Resume Builder menu
- `Footer` - Page footer
- `ChatBot` - Floating AI chatbot (rendered on all pages)
- `ScrollToTop` - Route scroll restoration
- `theme-provider` - Dark/light theme context

**Authentication:**
- `Login` - Login form (email/password + Google OAuth)
- `Signup` - Registration form
- `GoogleCallback` - OAuth callback handler

**Job Browsing:**
- `Home` - Landing page with hero section, job carousel
- `Jobs` - Job listing with advanced filtering
- `Job` - Job card component
- `JobDescription` - Detailed job view with apply button
- `FilterCard` - Advanced job filters (location, industry, salary, etc.)
- `CategoryCarousel` - Job category carousel
- `LatestJobs` / `LatestJobCards` - Recent job listings

**User Profile:**
- `Profile` - User dashboard (applied jobs, saved jobs, resumes)
- `ProfileEdit` - Edit profile form
- `UpdateProfileDialog` - Modal for profile editing
- `AppliedJobTable` - Table showing user's applications
- `SavedJobsTable` - Table showing saved jobs
- `MyResumesTable` - Profile page table with saved resumes

**Resume Builder:**
- `ResumeBuilder` - Main resume builder with form sections
- `ResumeForm` - Wrapper for all resume input sections
- `ResumePreview` - Live preview with markdown rendering
- `ResumePDFContent` - PDF content component
- `pdfGenerator.js` - PDF generation utilities

**ATS & AI:**
- `ATSCheck` - ATS score analyzer with file upload
- `ChatBot` - Workflow-driven AI assistant

**Admin (Recruiter):**
- `ProtectedRoute` - Role-based route protection
- `Companies` / `CompaniesTable` - Company list
- `CompanyCreate` - Create new company
- `CompanySetup` - Edit company details
- `AdminJobs` / `AdminJobsTable` - Job list
- `PostJob` - Create new job posting
- `JobSetup` - Edit job posting
- `Applicants` / `ApplicantsTable` - View/manage applicants

**UI Components (Radix UI):**
- avatar, badge, button, carousel, dialog
- input, label, popover, radio-group, select
- sonner (toasts), table, textarea

### Custom Hooks
- `useGetAllJobs()` - Fetch all public jobs
- `useGetAllCompanies()` - Fetch recruiter's companies
- `useGetAppliedJobs()` - Fetch user's applied jobs
- `useGetCompanyById()` - Fetch single company details
- `useGetAllAdminJobs()` - Fetch recruiter's posted jobs

---

## 6. Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                  Authentication Flow                │
└─────────────────────────────────────────────────────┘

1. Email/Password Registration
   ├─ Fill signup form (name, email, password, phone, role)
   ├─ Optional: Upload profile photo
   ├─ Password hashed with bcryptjs
   ├─ User created in MongoDB with authProvider: 'email'
   └─ JWT token generated and stored in HTTP-only cookie

2. Email/Password Login
   ├─ User selects role (Candidate/Recruiter)
   ├─ POST to /api/v1/user/login
   ├─ Verify email exists and role matches
   ├─ Compare password with bcryptjs
   ├─ Generate JWT token (expires in 1 day)
   ├─ Store in HTTP-only cookie
   ├─ Store in Redux auth slice
   └─ Redirect to home or profile

3. Google OAuth 2.0 Flow
   ├─ User selects role first
   ├─ Redirect to /api/v1/user/auth/google?role=student|recruiter
   ├─ Google authentication popup
   ├─ Callback to /api/v1/user/auth/google/callback
   ├─ Passport.js validates Google profile
   ├─ If email exists: Link Google ID to existing account
   ├─ If new: Create account with selected role, authProvider: 'google'
   ├─ JWT token generated
   ├─ Redirect to frontend /auth/google/callback?token=xxx
   ├─ Frontend stores token and fetches user data
   └─ Redirect to appropriate dashboard

4. Authentication Middleware (isAuthenticated.js)
   ├─ Check JWT token in cookies
   ├─ Verify token signature with SECRET_KEY
   ├─ Decode and attach user info to req.id
   └─ Proceed or reject with 401

5. Optional Auth Middleware (optionalAuth.js)
   ├─ Check JWT token in cookies (if present)
   ├─ If valid: Attach user info to request
   ├─ If missing/invalid: Allow request to proceed without user
   └─ Used for chatbot (allows guest + authenticated users)

6. Role-Based Access
   ├─ Student role: Browse jobs, apply, save, build resumes, ATS check
   ├─ Recruiter role: Post jobs, manage companies, view applicants
   └─ ProtectedRoute component validates role before rendering
```

---

## 7. Job Application Flow

```
┌────────────────────────────────────────────────────────┐
│           Job Application Process (Student View)       │
└────────────────────────────────────────────────────────┘

1. Browse Jobs
   ├─ User visits /jobs page
   ├─ Frontend calls GET /api/v1/job/get
   ├─ Jobs displayed in grid with cards
   └─ Advanced filters available:
      ├─ Location
      ├─ Industry
      ├─ Job Type (Full-time, Part-time, Contract, etc.)
      ├─ Experience Level
      ├─ Salary Range (min/max)
      ├─ Skills
      └─ Search Text

2. View Job Details
   ├─ Click on job card → navigate to /description/:id
   ├─ GET /api/v1/job/:id called
   ├─ Full job details + requirements shown
   ├─ Check if user already applied (compare applicant IDs)
   └─ Display "Apply" or "Already Applied" button
   └─ Display "Save Job" heart icon

3. Apply for Job
   ├─ Click "Apply Now" button
   ├─ GET /api/v1/application/apply/:jobId sent
   ├─ Backend checks:
   │  ├─ Is user authenticated?
   │  ├─ Does job exist?
   │  └─ Has user already applied?
   ├─ If duplicate: Return error toast
   ├─ If new: Create Application record
   ├─ Add application ID to Job.applications array
   └─ Show success toast

4. Track Applications
   ├─ Visit /profile page
   ├─ Fetch GET /api/v1/application/get
   ├─ Display AppliedJobTable with:
   │  ├─ Job title
   │  ├─ Company name
   │  ├─ Application status (Pending/Accepted/Rejected)
   │  └─ Applied date
   └─ Can withdraw application via DELETE /api/v1/application/:id

5. Save Jobs
   ├─ Click heart icon on job card or description page
   ├─ POST /api/v1/user/save-job/:id (toggle)
   ├─ Add/remove job ID from User.savedJobs array
   └─ View saved jobs in /profile → SavedJobsTable
```

---

## 8. Recruiter Job Posting Flow

```
┌────────────────────────────────────────────────────────┐
│        Recruiter Job Posting Process                   │
└────────────────────────────────────────────────────────┘

1. Create Company
   ├─ Navigate to /admin/companies/create
   ├─ Fill company form (name, description, website, location)
   ├─ Upload company logo to Cloudinary
   ├─ POST /api/v1/company/register
   └─ Company created and linked to recruiter user

2. Post Job Listing
   ├─ Go to /admin/jobs/create
   ├─ Fill job form:
   │  ├─ Job title, description
   │  ├─ Requirements list
   │  ├─ Salary, experience level
   │  ├─ Job type, location
   │  ├─ Number of positions
   │  └─ Select company
   ├─ POST /api/v1/job/post
   └─ Job created with created_by = recruiter's ID

3. View Applications
   ├─ Navigate to /admin/jobs/:id/applicants
   ├─ GET /api/v1/application/:jobId/applicants
   ├─ Display ApplicantsTable with:
   │  ├─ Applicant name
   │  ├─ Email, phone
   │  ├─ Resume link
   │  ├─ Current application status
   │  └─ Update status action
   └─ Can view full applicant profile

4. Update Application Status
   ├─ Click status dropdown
   ├─ Select: pending, accepted, rejected
   ├─ POST /api/v1/application/status/:applicationId/update
   ├─ Create notification for student
   └─ Status updated in UI

5. Manage Job Listings
   ├─ View all posted jobs in /admin/jobs
   ├─ Edit job details via /admin/jobs/:id
   ├─ Delete job postings
   └─ Track total applicants per job
```

---

## 9. Resume Management Flow

```
┌────────────────────────────────────────────────────┐
│        Resume Builder & Management Flow             │
└────────────────────────────────────────────────────┘

1. Create Resume (Any User)
   ├─ Visit /resume-builder
   ├─ Fill 8 sections: personal, summary, skills, education, experience, projects, certificates, references
   ├─ Live preview available
   ├─ Can download PDF locally (guest or logged-in)
   └─ If NOT logged-in: "Login to Save" button shown

2. Save Resume (Logged-In Users Only)
   ├─ Enter resume title
   ├─ Click "Save Resume"
   ├─ Frontend generates PDF as base64
   ├─ POST /api/v1/resume/save with resumeData + pdfBase64
   ├─ Backend:
   │  ├─ Upload PDF to Cloudinary (folder: resumes/{userId})
   │  ├─ Store resumeData JSON in MongoDB
   │  ├─ Store pdfUrl and pdfPublicId
   │  └─ Return saved resume object with _id
   ├─ Redux dispatches addResume
   └─ Success toast shown

3. View My Resumes (Logged-In Students)
   ├─ Visit /profile → "My Resumes" section
   ├─ Table displays all saved resumes with columns:
   │  ├─ Title
   │  ├─ Template Type (UI/LaTeX)
   │  ├─ Created Date
   │  └─ Actions (Edit, Download, Delete)
   └─ GET /api/v1/resume fetches all resumes

4. Edit Resume
   ├─ Click "Edit" on resume row
   ├─ Redux dispatches setCurrentResume with resumeData and _id
   ├─ Navigate to /resume-builder
   ├─ Form pre-populated with resume data
   ├─ "Save Resume" button becomes "Update Resume"
   ├─ Edit resume data
   ├─ Click "Update Resume"
   ├─ PUT /api/v1/resume/:id with new data + new PDF
   ├─ Backend:
   │  ├─ Delete old PDF from Cloudinary using pdfPublicId
   │  ├─ Upload new PDF
   │  ├─ Update resume record
   │  └─ Return updated object
   ├─ Redux dispatches updateResumeInList
   └─ Return to profile with updated list

5. Download Resume
   ├─ Click "Download" on resume row
   ├─ Direct download from Cloudinary pdfUrl
   ├─ No local PDF regeneration
   └─ File named: {resume.title}.pdf

6. Delete Resume
   ├─ Click "Delete" on resume row
   ├─ Confirm dialog shown
   ├─ DELETE /api/v1/resume/:id
   ├─ Backend:
   │  ├─ Delete PDF from Cloudinary
   │  ├─ Delete resume record
   │  └─ Return success
   ├─ Redux dispatches removeResumeFromList
   ├─ Row removed from table
   └─ Success toast shown

7. Export Resume
   ├─ Click "Export JSON" option
   ├─ Downloads resume data as JSON file
   └─ Can be used for backup or import
```

---

## 10. ATS Score Checker Flow

```
┌────────────────────────────────────────────────────┐
│           ATS Score Checker Feature                 │
└────────────────────────────────────────────────────┘

1. Access ATS Checker
   ├─ Navigate to /ats-check
   ├─ No authentication required
   └─ Available to all users

2. Input Data
   ├─ Upload resume file (PDF or DOCX)
   ├─ Paste or type job description
   └─ Click "Analyze Resume"

3. Backend Processing (POST /api/v1/ats/check)
   ├─ Parse resume file:
   │  ├─ PDF: Use pdf-parse library
   │  └─ DOCX: Use mammoth library
   ├─ Extract text content from resume
   ├─ Analyze with rule-based keyword matching:
   │  ├─ Extract keywords from job description
   │  ├─ Match against tech skills database
   │  ├─ Detect resume sections (education, experience, skills)
   │  └─ Extract years of experience
   ├─ Optional: Enhanced AI analysis with Gemini 2.0 Flash
   │  ├─ Deeper semantic analysis
   │  ├─ Context-aware matching
   │  └─ Retry logic with rate limit handling
   └─ Return analysis results

4. Display Results
   ├─ Overall ATS Score (percentage)
   ├─ Matched Skills (found in both resume and job)
   ├─ Missing Skills (in job but not in resume)
   ├─ Section Analysis (detected sections)
   ├─ Improvement Tips
   └─ Summary recommendation
```

---

## 11. AI Chatbot Flow

```
┌────────────────────────────────────────────────────┐
│           AI Chatbot Feature                        │
└────────────────────────────────────────────────────┘

1. Access Chatbot
   ├─ Floating chatbot icon on all pages
   ├─ Click to open chat interface
   └─ Works for both guests and authenticated users

2. Workflow-Driven Conversation
   ├─ Button-based navigation options
   ├─ Context-aware responses
   └─ Progressive workflow steps

3. Available Actions:
   
   For Guests:
   ├─ Browse Jobs (view job listings)
   ├─ Search Jobs by keyword
   └─ Login prompt for application features

   For Authenticated Students:
   ├─ Browse Jobs
   ├─ Apply for Jobs (with eligibility check)
   │  ├─ Check profile completeness
   │  ├─ Check resume uploaded
   │  └─ Guide to fix missing requirements
   ├─ View My Applications
   ├─ Profile Status Check
   └─ Job Recommendations

4. Backend Processing (POST /api/v1/chatbot/message)
   ├─ Uses optionalAuth middleware
   ├─ Identifies user state (guest vs authenticated)
   ├─ Validates eligibility for actions
   ├─ Returns structured response with:
   │  ├─ Text message
   │  ├─ Action buttons
   │  ├─ Job listings (if applicable)
   │  └─ Next step suggestions
   └─ Enforces business rules (profile + resume for apply)
```

---

## 12. Data Flow Diagram

### Level 0 - Context Diagram
```
                           ┌─────────────┐
                           │   MongoDB   │
                           │  (Atlas)    │
                           └──────┬──────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────▼────────┐ ┌───────▼───────┐ ┌────────▼────────┐
    │    Frontend      │ │   Backend     │ │  External       │
    │ (React/Redux)    │◄┤► (Express.js) │◄┤► Services       │
    └────────┬─────────┘ └───────────────┘ └─────────────────┘
             │                                    │
             │ HTTP/REST (Axios)                  │
             │                                    │
             └────────────────────────────────────┘
                         
External Services:
├─ Cloudinary (File Storage)
├─ Google OAuth 2.0 (Authentication)
└─ Google Gemini AI (ATS Analysis)
```

### Level 1 - Main Process Flow
```
                        ┌─────────────────────────────┐
                        │     HIREHUB System          │
                        │                             │
        ┌───────────────────────────────────────────────────────┐
        │                                                       │
        │  1. Authentication Service                           │
        │     ├─ Register/Login/Logout (Email)                 │
        │     ├─ Google OAuth 2.0 Integration                  │
        │     ├─ Password hashing (bcryptjs)                   │
        │     ├─ JWT token generation                          │
        │     └─ Password management (change/set)              │
        │                                                       │
        │  2. Job Management Service                           │
        │     ├─ Create/Read/Update jobs                       │
        │     ├─ Advanced search & filters                     │
        │     └─ Populate job with company & applications      │
        │                                                       │
        │  3. Application Service                              │
        │     ├─ Create/withdraw applications                  │
        │     ├─ Track application status                      │
        │     ├─ Check duplicate applications                  │
        │     ├─ Get applicants for recruiter                  │
        │     └─ Update status with notifications              │
        │                                                       │
        │  4. Company Service                                  │
        │     ├─ Create/Read/Update company                    │
        │     ├─ Upload logo to Cloudinary                     │
        │     └─ Link to recruiter                             │
        │                                                       │
        │  5. Profile Service                                  │
        │     ├─ Update user profile                           │
        │     ├─ Upload resume & profile photo                 │
        │     ├─ Manage notifications & saved jobs             │
        │     └─ Social links (LinkedIn, GitHub)               │
        │                                                       │
        │  6. Resume Builder Service                           │
        │     ├─ Create/Edit/Delete resumes                    │
        │     ├─ PDF generation & cloud storage                │
        │     └─ Template support (UI/LaTeX)                   │
        │                                                       │
        │  7. ATS Score Service                                │
        │     ├─ Parse resume files (PDF/DOCX)                 │
        │     ├─ Keyword extraction & matching                 │
        │     └─ AI-enhanced analysis (Gemini)                 │
        │                                                       │
        │  8. Chatbot Service                                  │
        │     ├─ Workflow-driven conversations                 │
        │     ├─ Job browsing & application assistance         │
        │     └─ Profile eligibility checks                    │
        │                                                       │
        └───────────────────────────────────────────────────────┘
```

### Data Store Mapping
```
┌─────────────────────────────────────────────────────┐
│              MongoDB Collections                     │
├─────────────────────────────────────────────────────┤
│ Users                                               │
│ ├─ Login credentials (email/password or Google)    │
│ ├─ Profile information (bio, skills, resume, links)│
│ ├─ Role (student/recruiter)                        │
│ ├─ Auth provider (email/google)                    │
│ ├─ Notifications                                    │
│ └─ Saved jobs references                            │
│                                                     │
│ Jobs                                                │
│ ├─ Job posting details                              │
│ ├─ Requirements & qualifications                    │
│ ├─ Applications array (references)                  │
│ └─ Created by recruiter reference                   │
│                                                     │
│ Applications                                        │
│ ├─ Job reference                                    │
│ ├─ Applicant reference                              │
│ └─ Status tracking (pending/accepted/rejected)      │
│                                                     │
│ Companies                                           │
│ ├─ Company details                                  │
│ ├─ Logo URL (Cloudinary)                            │
│ ├─ Compound unique index: { name, userId }          │
│ └─ Recruiter reference                              │
│                                                     │
│ Resumes                                             │
│ ├─ User reference (indexed for fast queries)        │
│ ├─ Resume title & data (JSON)                       │
│ ├─ Template type (UI or LaTeX)                      │
│ ├─ PDF URL (Cloudinary secure URL)                  │
│ ├─ PDF public ID (for deletion)                     │
│ └─ Timestamps (created, updated)                    │
└─────────────────────────────────────────────────────┘
```

---

## 13. Key Features Breakdown

### Resume Builder Feature
- **Guest Users (Not Logged In):**
  - Can build resume with 8 sections (personal, summary, skills, education, experience, projects, certificates, references)
  - Can preview resume in real-time
  - Can download PDF locally
  - CANNOT save resume to database
  - Login prompt shown for save functionality

- **Logged-In Users:**
  - All guest features PLUS:
  - Can save resume to database with custom title
  - PDF automatically uploaded to Cloudinary (folder: resumes/{userId})
  - Can edit saved resumes (loads into builder, regenerates PDF)
  - Can delete saved resumes (removes from DB and Cloudinary)
  - Can download saved PDFs from Cloudinary URL
  - Can export resume data as JSON
  - My Resumes table in Profile page shows all saved resumes
  - Supports two templates: UI Builder (structured form) and LaTeX

### ATS Score Checker Feature
- **Public Access** (no login required)
- Upload resume (PDF or DOCX format)
- Paste job description text
- **Analysis includes:**
  - Overall ATS compatibility score (percentage)
  - Matched skills (found in both resume and job)
  - Missing skills (in job but not in resume)
  - Section detection (education, experience, skills, etc.)
  - Experience years extraction
  - Improvement tips and recommendations
- **Optional AI Enhancement** with Google Gemini for deeper analysis

### AI Chatbot Feature
- **Floating chatbot** accessible on all pages
- **Works for guests and authenticated users**
- **Workflow-driven conversation** with button navigation
- **Capabilities:**
  - Browse available jobs
  - Search jobs by keyword
  - Apply for jobs (authenticated only)
  - Check profile completeness
  - View application status
  - Get job recommendations
- **Eligibility enforcement** for job applications (requires complete profile + resume)

### Student Features
- **Job Search**: Browse all jobs with keyword search
- **Advanced Job Filtering**: Filter by location, industry, job type, experience, salary range, skills
- **Apply for Jobs**: One-click apply with duplicate prevention
- **Track Applications**: View all applied jobs with status updates (Pending/Accepted/Rejected)
- **Profile Management**: Upload resume, add skills, update bio, add social links (LinkedIn, GitHub)
- **Save Jobs**: Bookmark interesting jobs for later
- **Resume Builder**: Create professional resumes with PDF export
- **ATS Score Checker**: Analyze resume against job descriptions
- **AI Chatbot**: Get help with job search and applications
- **Notifications**: Receive updates on application status changes
- **Dark Mode**: Comfortable viewing experience with theme toggle
- **Google OAuth**: Sign in with Google account
- **Password Management**: Change password or set password (for Google users)

### Recruiter Features
- **Company Management**: Create and edit company profiles with logo upload
- **Job Posting**: Post job listings with detailed requirements
- **Application Management**: View all applicants for each job
- **Applicant Screening**: Filter and sort applicants
- **Status Updates**: Accept/reject applications with notifications to students
- **Analytics**: Track total applicants per job
- **Job Editing**: Update job postings
- **Profile Management**: Recruiter-specific profile fields (designation, company details)
- **Dark Mode**: Theme toggle support
- **Google OAuth**: Sign in with Google account

### Common Features
- **Authentication**: Secure JWT-based login with HTTP-only cookies
- **Google OAuth 2.0**: One-click Google authentication
- **Profile View**: Public profile viewing
- **Dark/Light Theme**: Persistent theme preference via next-themes
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Toast Notifications**: Real-time feedback with Sonner
- **File Uploads**: Resume and profile photo upload via Cloudinary
- **Animations**: Smooth transitions with Framer Motion

---

## 14. Security Measures

- **Password Security**: Bcryptjs hashing with salt rounds
- **JWT Tokens**: HTTP-only cookies for token storage (prevents XSS)
- **Token Expiry**: Configurable JWT expiration (default: 1 day)
- **Authentication Middleware**: isAuthenticated.js validates all protected routes
- **Optional Auth Middleware**: optionalAuth.js for mixed-access endpoints
- **Role-Based Access Control**: Routes check user role before granting access
- **Protected Routes**: Frontend ProtectedRoute component validates role
- **Google OAuth Security**: Passport.js with secure token handling
- **Cloudinary Integration**: Secure file uploads with CDN delivery
- **CORS Configuration**: Allows specific origins with credentials
- **Input Validation**: Server-side validation before database operations
- **Cookie Parser**: Secure cookie handling with cookie-parser
- **Environment Variables**: Sensitive data stored in .env files
- **Session Management**: express-session for OAuth flow

---

## 15. Performance Optimizations

- **Redux Persist**: Persisted state across page refreshes
- **Redux State Management**: Centralized state prevents prop drilling
- **Custom Hooks**: Reusable data fetching logic
- **Vite Bundling**: Fast development and production builds
- **TailwindCSS**: Optimized utility-first CSS with JIT compilation
- **Cloudinary CDN**: Image optimization and caching
- **MongoDB Indexing**: Indexed fields for fast queries (email, userId)
- **Compound Indexes**: Optimized queries (company name + userId)
- **Lazy Loading**: Component-based code splitting potential
- **State Persistence**: LocalStorage for Redux state

---

## 16. Error Handling

- **Frontend**: Toast notifications (Sonner) for user feedback
- **Backend**: Comprehensive error catching with proper HTTP status codes
- **Application Logic**: Duplicate application prevention
- **File Uploads**: Validation and size limits via Multer
- **Network Errors**: Axios interceptors for error handling
- **Console Logging**: Debug logging for troubleshooting
- **AI Service Retry**: Retry logic with rate limit handling for Gemini API

---

## 17. Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Cloudinary** | File upload and image/PDF hosting |
| **MongoDB Atlas** | Cloud database hosting |
| **Google OAuth 2.0** | Social authentication via Passport.js |
| **Google Gemini AI** | AI-powered ATS analysis (Gemini 2.0 Flash) |
| **Multer** | Server-side file handling |
| **pdf-parse** | PDF file text extraction |
| **mammoth** | DOCX file text extraction |
| **Radix UI** | Accessible UI components |
| **Framer Motion** | Animation library |
| **html2pdf.js / jspdf** | PDF generation on frontend |

---

## 18. Environment Variables Required

```bash
# Backend (.env)

# Server Configuration
PORT=3000
SECRET_KEY=your_jwt_secret

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hirehub

# JWT Configuration
JWT_EXPIRES_IN=1d

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/user/auth/google/callback

# Frontend URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173

# AI Services (Optional - for enhanced ATS analysis)
GEMINI_API_KEY=your_google_gemini_api_key
```

```bash
# Frontend (.env)

# API Base URL
VITE_API_BASE_URL=http://localhost:3000

# Google OAuth Client ID (for frontend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 19. Deployment Considerations

- **Frontend**: Deploy to Vercel, Netlify, or similar (Vite build)
- **Backend**: Deploy to Railway, Render, Heroku, or AWS (Node.js)
- **Database**: MongoDB Atlas for managed cloud database
- **File Storage**: Cloudinary for all file uploads (resumes, photos, logos)
- **Environment Variables**: Configure in deployment platform dashboard
- **CORS**: Update CLIENT_URL and GOOGLE_CALLBACK_URL for production domain
- **Google OAuth**: Update authorized redirect URIs in Google Cloud Console
- **Domain Configuration**: Set up custom domains for frontend and backend

---

## 20. Project File Structure

```
hireHub_Mern_Project/
├── backend/
│   ├── index.js                    # Express server entry point
│   ├── package.json                # Backend dependencies
│   ├── controllers/
│   │   ├── application.controller.js
│   │   ├── ats.controller.js
│   │   ├── chatbot.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   ├── resume.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── isAuthenticated.js      # JWT auth middleware
│   │   ├── multer.js               # File upload middleware
│   │   └── optionalAuth.js         # Optional auth middleware
│   ├── models/
│   │   ├── application.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   ├── resume.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── application.route.js
│   │   ├── ats.route.js
│   │   ├── chatbot.route.js
│   │   ├── company.route.js
│   │   ├── job.route.js
│   │   ├── resume.route.js
│   │   └── user.route.js
│   └── utils/
│       ├── aiService.js            # Gemini AI integration
│       ├── atsAnalyzer.js          # ATS scoring logic
│       ├── cloudinary.js           # Cloudinary config
│       ├── datauri.js              # File to data URI
│       ├── db.js                   # MongoDB connection
│       ├── passport.js             # Google OAuth config
│       └── resumeParser.js         # PDF/DOCX parsing
│
├── frontend/
│   ├── index.html
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js
│   ├── components.json             # Radix UI config
│   ├── public/                     # Static assets
│   └── src/
│       ├── App.jsx                 # Main router
│       ├── main.jsx                # Entry point with providers
│       ├── index.css               # Global styles
│       ├── App.css
│       ├── components/
│       │   ├── auth/               # Login, Signup, GoogleCallback
│       │   ├── admin/              # Recruiter dashboard components
│       │   ├── resume/             # Resume builder components
│       │   ├── shared/             # Navbar, Footer
│       │   ├── ui/                 # Radix UI wrappers
│       │   └── *.jsx               # Feature components
│       ├── hooks/                  # Custom React hooks
│       ├── lib/
│       │   └── utils.js            # Utility functions
│       ├── redux/
│       │   ├── store.js            # Redux store config
│       │   ├── authSlice.js
│       │   ├── jobSlice.js
│       │   ├── companySlice.js
│       │   ├── applicationSlice.js
│       │   ├── resumeSlice.js
│       │   └── savedJobSlice.js
│       └── utils/
│           ├── constant.js         # API endpoints
│           └── resumeAPI.js        # Resume API helpers
│
├── PROJECT_ARCHITECTURE.md         # This file
├── GOOGLE_AUTH_SETUP.md            # Google OAuth setup guide
├── QUICK_START.md                  # Quick start guide
└── README.md
```

---

## 21. Future Enhancement Opportunities

- **Email Notifications**: Send status updates via email (Nodemailer/SendGrid)
- **Messaging System**: Direct recruiter-student communication
- **Video Interviews**: Integration with video calling service
- **Skill Verification**: Automated skill assessments
- **Salary Analytics**: Job market salary insights
- **Mobile App**: React Native version
- **Advanced Analytics**: Dashboard metrics for recruiters
- **Premium Features**: Featured job listings, top recruiter badge
- **Job Recommendations**: AI-powered job matching
- **Interview Scheduling**: Calendar integration for interviews
- **Multi-language Support**: Internationalization (i18n)

---

## Summary

HIREHUB is a comprehensive, full-featured job portal built with the MERN stack. The application features:

**Core Functionality:**
- Role-based access (Students and Recruiters)
- Complete job posting and application workflow
- Company profile management
- Advanced job search with multiple filters

**Modern Authentication:**
- JWT-based email/password authentication
- Google OAuth 2.0 integration
- Secure HTTP-only cookie storage

**AI-Powered Features:**
- ATS Score Checker with keyword analysis
- AI Chatbot for job browsing and application assistance
- Resume parsing and analysis

**Developer Experience:**
- Clean separation of concerns
- Modular component architecture
- Redux Toolkit for state management
- Custom hooks for data fetching
- Comprehensive API documentation

The system is production-ready with proper authentication, error handling, responsive design, and dark mode support. The modular architecture allows for easy feature additions and maintenance.
