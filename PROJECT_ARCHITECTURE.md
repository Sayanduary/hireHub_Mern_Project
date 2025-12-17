# HIREHUB - Project Architecture Documentation

## 1. Executive Summary

**HIREHUB** is a full-stack MERN (MongoDB, Express, React, Node.js) job portal application with two distinct user roles: Students and Recruiters. The platform enables students to search for jobs, apply to positions, and track their applications, while recruiters can post job listings, manage applications, and build their company profiles.

---

## 2. System Overview

### Key Features
- **Authentication System**: JWT-based login/signup with role-based access (Student/Recruiter)
- **Job Management**: Complete CRUD operations for job postings
- **Application System**: Apply, track, and manage job applications
- **Company Management**: Recruiters can create and manage company profiles
- **Profile Management**: Students can update profiles with resume, skills, and bio
- **File Uploads**: Resume uploads via Cloudinary
- **Responsive Design**: Full dark mode support with customizable theme
- **Saved Jobs**: Students can save jobs for later review
- **Application Status Tracking**: Recruiters can update application statuses (pending, accepted, rejected)

### Technology Stack

**Frontend:**
- React 18 with Vite
- Redux Toolkit for state management
- React Router v6 for navigation
- TailwindCSS for styling
- Radix UI components library
- Framer Motion for animations
- Axios for HTTP requests

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcryptjs for password hashing
- Cloudinary for file uploads
- Multer for file handling

---

## 3. Database Schema

### User Model
```
{
  fullname: String (required),
  email: String (unique, required),
  phoneNumber: Number (required),
  password: String (hashed, required),
  role: Enum ['student', 'recruiter'],
  
  profile: {
    bio: String,
    skills: [String],
    resume: String (URL),
    resumeOriginalName: String,
    company: ObjectId (ref: Company),
    profilePhoto: String (URL)
  },
  
  notifications: [{
    message: String,
    type: Enum ['application_status', 'general'],
    jobId: ObjectId (ref: Job),
    applicationId: ObjectId (ref: Application),
    read: Boolean
  }],
  
  savedJobs: [ObjectId (ref: Job)]
}
```

### Job Model
```
{
  title: String (required),
  description: String (required),
  requirements: [String],
  salary: Number (required),
  experienceLevel: Number (required) // in years,
  location: String (required),
  jobType: String (required),
  position: Number (required) // number of openings,
  
  company: ObjectId (ref: Company, required),
  created_by: ObjectId (ref: User, required),
  applications: [ObjectId (ref: Application)],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```
{
  job: ObjectId (ref: Job, required),
  applicant: ObjectId (ref: User, required),
  status: Enum ['pending', 'accepted', 'rejected'] (default: 'pending'),
  
  createdAt: Date,
  updatedAt: Date
}
```

### Company Model
```
{
  name: String (unique, required),
  description: String,
  website: String,
  location: String,
  logo: String (Cloudinary URL),
  
  userId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. API Endpoints

### User Endpoints (`/api/v1/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `GET /profile` - Get user profile
- `POST /profile/update` - Update user profile
- `POST /upload-profile-photo` - Upload profile photo
- `POST /upload-resume` - Upload resume

### Job Endpoints (`/api/v1/job`)
- `POST /post` - Create new job (Recruiter only)
- `GET /get` - Get all jobs with pagination
- `GET /:id` - Get job details by ID
- `PUT /:id` - Update job (Recruiter only)
- `DELETE /:id` - Delete job (Recruiter only)
- `GET /search?keyword=` - Search jobs by keyword

### Application Endpoints (`/api/v1/application`)
- `GET /apply/:id` - Apply for a job (Student)
- `GET /get` - Get user's applied jobs (Student)
- `DELETE /:id` - Withdraw application (Student)
- `GET /:id/applicants` - Get applicants for a job (Recruiter)
- `POST /status/:id/update` - Update application status (Recruiter)

### Company Endpoints (`/api/v1/company`)
- `POST /register` - Create company (Recruiter)
- `GET /get` - Get all companies
- `GET /:id` - Get company details
- `PUT /:id` - Update company info (Recruiter)

---

## 5. Frontend Architecture

### Route Structure
```
/                       - Home page (browse jobs, hero section)
/jobs                   - Job listing with filters
/description/:id        - Job details page
/profile                - User profile (student/recruiter view)
/login                  - Login page
/signup                 - Signup page

/admin/companies        - List all companies (Recruiter)
/admin/companies/create - Create new company
/admin/companies/:id    - Edit company details
/admin/jobs             - Recruiter's job listings
/admin/jobs/create      - Post new job
/admin/jobs/:id         - Edit job posting
/admin/jobs/:id/applicants - View applicants for a job
```

### Redux Store Structure
```
store
├── auth
│   ├── user
│   ├── loading
│   └── token
├── job
│   ├── allJobs
│   ├── singleJob
│   └── searchJobByText
├── company
│   ├── singleCompany
│   └── companies
├── application
    ├── applicants
    └── allAppliedJobs
```

### Key Components
- **Navbar** - Global navigation with theme toggle
- **Home** - Landing page with hero section, job carousel
- **Jobs** - Job listing with category filter
- **JobDescription** - Detailed job view with apply button
- **Profile** - User dashboard (Student shows applied jobs, Recruiter shows job postings)
- **AdminJobs** - Recruiter's job management dashboard
- **Companies** - Company management for recruiters
- **UpdateProfileDialog** - Modal for profile editing
- **AppliedJobTable** - Table showing student's applications
- **Applicants** - Recruiter's view of job applicants

### Custom Hooks
- `useGetAllJobs()` - Fetch all jobs
- `useGetAllCompanies()` - Fetch all companies
- `useGetAppliedJobs()` - Fetch user's applied jobs
- `useGetCompanyById()` - Fetch single company details
- `useGetAllAdminJobs()` - Fetch recruiter's posted jobs

---

## 6. Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                  Authentication Flow                │
└─────────────────────────────────────────────────────┘

1. User Signup
   ├─ Fill signup form (email, password, role: student/recruiter)
   ├─ Password hashed with bcryptjs
   ├─ User created in MongoDB
   └─ JWT token generated and stored in HTTP-only cookie

2. User Login
   ├─ Verify email exists
   ├─ Compare password with bcryptjs
   ├─ Generate JWT token
   ├─ Store in Redux auth slice
   └─ Redirect to appropriate dashboard

3. Authentication Middleware (isAuthenticated.js)
   ├─ Check JWT token in cookies
   ├─ Verify token signature
   ├─ Attach user info to request
   └─ Proceed or reject with 401

4. Role-Based Access
   ├─ Student role: Can apply, browse jobs, update profile
   ├─ Recruiter role: Can post jobs, manage companies, view applicants
   └─ Protected routes validate role before rendering
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
   ├─ Jobs displayed in grid/list
   └─ Can filter by category or search by keyword

2. View Job Details
   ├─ Click on job card → navigate to /description/:id
   ├─ GET /api/v1/job/:id called
   ├─ Full job details + requirements shown
   ├─ Check if user already applied (compare applicant IDs)
   └─ Display "Apply" or "Already Applied" button

3. Apply for Job
   ├─ Click "Apply" button
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
   │  ├─ Application status (pending/accepted/rejected)
   │  └─ Applied date
   └─ Can withdraw application via DELETE /api/v1/application/:id

5. Save Jobs
   ├─ Click heart icon on job card
   ├─ Add job ID to User.savedJobs array
   └─ View saved jobs in /profile section
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

## 9. Data Flow Diagram

### Level 0 - Context Diagram
```
                           ┌─────────────┐
                           │   MongoDB   │
                           │ (Database)  │
                           └──────┬──────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────▼────────┐ ┌───────▼───────┐ ┌────────▼────────┐
    │    Frontend      │ │   Backend     │ │  External       │
    │ (React/Redux)    │ │ (Express.js)  │ │  Services       │
    └────────┬────────┘ └───────────────┘ └────────────────┘
             │                                    ▲
             │ HTTP/REST                         │
             │ (Axios)                           │
             └─────────────────────────────────┘
                                              JWT Auth
```

### Level 1 - Main Process Flow
```
                        ┌─────────────────────────────┐
                        │     HIREHUB System          │
                        │                             │
        ┌───────────────────────────────────────────────────────┐
        │                                                       │
        │  1. Authentication Service                           │
        │     ├─ Register/Login/Logout                         │
        │     ├─ Password hashing (bcryptjs)                   │
        │     └─ JWT token generation                          │
        │                                                       │
        │  2. Job Management Service                           │
        │     ├─ Create/Read/Update/Delete jobs                │
        │     ├─ Search/Filter jobs                            │
        │     └─ Populate job with company & applications      │
        │                                                       │
        │  3. Application Service                              │
        │     ├─ Create applications                           │
        │     ├─ Track application status                      │
        │     ├─ Check duplicate applications                  │
        │     └─ Get applicants for recruiter                  │
        │                                                       │
        │  4. Company Service                                  │
        │     ├─ Create/Read/Update company                    │
        │     ├─ Upload logo to Cloudinary                     │
        │     └─ Link to recruiter                             │
        │                                                       │
        │  5. Profile Service                                  │
        │     ├─ Update user profile                           │
        │     ├─ Upload resume & profile photo                 │
        │     └─ Manage notifications & saved jobs             │
        │                                                       │
        └───────────────────────────────────────────────────────┘
```

### Data Store Mapping
```
┌─────────────────────────────────────────────────────┐
│              MongoDB Collections                     │
├─────────────────────────────────────────────────────┤
│ Users                                               │
│ ├─ Login credentials & authentication               │
│ ├─ Profile information (bio, skills, resume)        │
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
│ └─ Recruiter reference                              │
└─────────────────────────────────────────────────────┘
```

---

## 10. Key Features Breakdown

### Student Features
- **Job Search**: Browse all jobs with keyword search
- **Job Filtering**: Filter by category, location, experience level
- **Apply for Jobs**: One-click apply with duplicate prevention
- **Track Applications**: View all applied jobs with status updates
- **Profile Management**: Upload resume, add skills, update bio
- **Save Jobs**: Bookmark interesting jobs for later
- **Notifications**: Receive updates on application status changes
- **Dark Mode**: Comfortable viewing experience with theme toggle

### Recruiter Features
- **Company Management**: Create and edit company profiles
- **Job Posting**: Post job listings with detailed requirements
- **Application Management**: View all applicants for each job
- **Applicant Screening**: Filter and sort applicants
- **Status Updates**: Accept/reject applications with notifications
- **Analytics**: Track total applicants per job
- **Job Editing**: Update or delete job postings
- **Dark Mode**: Theme toggle support

### Common Features
- **Authentication**: Secure JWT-based login/logout
- **Profile View**: Public profile viewing
- **Dark/Light Theme**: Persistent theme preference
- **Responsive Design**: Works on desktop, tablet, mobile
- **Toast Notifications**: Real-time feedback messages
- **File Uploads**: Resume and profile photo upload via Cloudinary

---

## 11. Security Measures

- **Password Security**: Bcryptjs hashing with salt rounds
- **JWT Tokens**: HTTP-only cookies for token storage
- **Authentication Middleware**: isAuthenticated.js validates all protected routes
- **Role-Based Access Control**: Routes check user role before granting access
- **Cloudinary Integration**: Secure file uploads with CDN delivery
- **CORS Configuration**: Allows specific origins with credentials
- **Input Validation**: Server-side validation before database operations
- **Cookie Parser**: Secure cookie handling

---

## 12. Performance Optimizations

- **Redux State Management**: Centralized state prevents prop drilling
- **Custom Hooks**: Reusable data fetching logic
- **Lazy Loading**: React Router lazy code splitting
- **Vite Bundling**: Fast development and production builds
- **TailwindCSS**: Optimized utility-first CSS
- **Cloudinary CDN**: Image optimization and caching
- **MongoDB Indexing**: Indexed email and other frequently queried fields
- **Pagination**: Job list pagination for large datasets

---

## 13. Error Handling

- **Frontend**: Toast notifications (Sonner) for user feedback
- **Backend**: Comprehensive error catching with proper HTTP status codes
- **Application Logic**: Duplicate application prevention
- **File Uploads**: Validation and size limits
- **Network Errors**: Retry logic in API calls
- **Console Logging**: Debug logging for troubleshooting

---

## 14. Third-Party Integrations

- **Cloudinary**: File upload and image hosting
- **MongoDB Atlas**: Cloud database hosting
- **Multer**: Server-side file handling
- **Radix UI**: Accessible UI components

---

## 15. Environment Variables Required

```
# Backend (.env)
PORT=3001
MONGODB_URI=<MongoDB connection string>
JWT_SECRET=<JWT signing secret>
CLOUDINARY_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001
```

---

## 16. Deployment Considerations

- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages (Vite build)
- **Backend**: Deploy to Heroku, Railway, or AWS (Node.js)
- **Database**: MongoDB Atlas for managed cloud database
- **File Storage**: Cloudinary for all file uploads
- **Environment Variables**: Set up in deployment platform
- **CORS**: Configure for production domain

---

## 17. Future Enhancement Opportunities

- **Messaging System**: Direct recruiter-student communication
- **Video Interviews**: Integration with video calling service
- **Skill Verification**: Recruiter verification of skills
- **Salary History**: Job market analytics
- **Email Notifications**: Send status updates via email
- **Mobile App**: React Native version
- **Advanced Analytics**: Dashboard metrics for recruiters
- **Premium Features**: Featured job listings, top recruiter badge

---

## Summary

HIREHUB is a well-structured, role-based job portal with clear separation between student and recruiter functionality. The MERN stack provides scalability, the Redux store ensures state consistency, and the modular component architecture allows for easy feature additions and maintenance. The system is production-ready with proper authentication, error handling, and responsive design.
