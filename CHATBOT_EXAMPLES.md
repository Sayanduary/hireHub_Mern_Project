# Workflow-Driven Chatbot - Example Scenarios

## Scenario 1: New User (Not Logged In)

### User Action: Opens Chatbot

**Backend Processing:**
```javascript
userState = {
  isLoggedIn: false,
  profileComplete: false,
  resumeUploaded: false,
  appliedJobs: [],
  eligibleJobs: [] // Fetched but user can't apply
}
```

**Response:**
```json
{
  "success": true,
  "message": "👋 Welcome to HireHub!\n\nPlease login or create an account to get started.",
  "buttons": [
    {
      "label": "🔐 Login",
      "action": "LOGIN",
      "payload": {}
    },
    {
      "label": "📝 Sign Up",
      "action": "SIGNUP",
      "payload": {}
    },
    {
      "label": "💼 Browse Jobs (Guest)",
      "action": "BROWSE_JOBS",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- Three buttons only
- Cannot see: Apply, Applications, Profile options
- Clear message: Need to login

---

## Scenario 2: Logged In, Profile Incomplete

### User Action: Clicks "Main Menu" after logging in

**Backend Processing:**
```javascript
userState = {
  isLoggedIn: true,
  profileComplete: false, // Missing bio, skills
  resumeUploaded: false,
  appliedJobs: [],
  eligibleJobs: [...]
}

// Check missing fields
missingFields = ['• Bio', '• Skills']
```

**Response:**
```json
{
  "success": true,
  "message": "⚠️ Your profile is incomplete!\n\nMissing fields:\n• Bio\n• Skills\n\n❌ You cannot apply for jobs until your profile is complete.",
  "buttons": [
    {
      "label": "👤 Complete Profile",
      "action": "COMPLETE_PROFILE",
      "payload": {}
    },
    {
      "label": "💼 Browse Jobs (View Only)",
      "action": "BROWSE_JOBS",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": "complete_profile"
}
```

**What User Sees:**
- Blocked from applying
- Clear list of what's missing
- Only valid actions shown

---

## Scenario 3: Profile Complete, No Resume

### User Action: Returns after completing profile

**Backend Processing:**
```javascript
userState = {
  isLoggedIn: true,
  profileComplete: true, // All fields filled
  resumeUploaded: false, // Still missing
  appliedJobs: [],
  eligibleJobs: [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "⚠️ You haven't uploaded your resume yet!\n\n❌ Resume is required to apply for jobs.",
  "buttons": [
    {
      "label": "📄 Upload Resume",
      "action": "UPLOAD_RESUME",
      "payload": {}
    },
    {
      "label": "💼 Browse Jobs (View Only)",
      "action": "BROWSE_JOBS",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": "upload_resume"
}
```

**What User Sees:**
- Still blocked from applying
- Single clear requirement: Resume
- Direct action available

---

## Scenario 4: Fully Qualified User

### User Action: Opens chatbot after uploading resume

**Backend Processing:**
```javascript
userState = {
  isLoggedIn: true,
  profileComplete: true,
  resumeUploaded: true,
  appliedJobs: ['job1', 'job2'], // Already applied to 2 jobs
  eligibleJobs: [
    { id: 'job3', title: 'React Developer', company: 'Tech Corp', ... },
    { id: 'job4', title: 'Backend Developer', company: 'Code Inc', ... },
    { id: 'job5', title: 'Full Stack Developer', company: 'Dev Ltd', ... }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "👋 Hello, John Doe!\n\nWhat would you like to do today?",
  "buttons": [
    {
      "label": "💼 Browse Jobs",
      "action": "BROWSE_JOBS",
      "payload": {}
    },
    {
      "label": "✅ Apply for Jobs",
      "action": "APPLY_JOB",
      "payload": {}
    },
    {
      "label": "📄 My Applications",
      "action": "VIEW_APPLICATIONS",
      "payload": {}
    },
    {
      "label": "👤 View Profile",
      "action": "VIEW_PROFILE",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- All features unlocked
- Personalized greeting
- Full menu available

---

## Scenario 5: Applying for Jobs

### User Action: Clicks "Apply for Jobs"

**Backend Processing:**
```javascript
// Filter out already applied jobs
eligibleJobs = allJobs.filter(job => 
  !appliedJobs.includes(job._id.toString())
)

// Result: 3 jobs available
```

**Response:**
```json
{
  "success": true,
  "message": "💼 Here are jobs you can apply to:\n\n1. React Developer\n   🏢 Tech Corp\n   📍 Mumbai\n   💰 ₹12 LPA\n\n2. Backend Developer\n   🏢 Code Inc\n   📍 Bangalore\n   💰 ₹15 LPA\n\n3. Full Stack Developer\n   🏢 Dev Ltd\n   📍 Pune\n   💰 ₹18 LPA\n\nSelect a job to apply:",
  "buttons": [
    {
      "label": "✅ React Developer",
      "action": "APPLY_TO_JOB",
      "payload": { "jobId": "job3" }
    },
    {
      "label": "✅ Backend Developer",
      "action": "APPLY_TO_JOB",
      "payload": { "jobId": "job4" }
    },
    {
      "label": "✅ Full Stack Developer",
      "action": "APPLY_TO_JOB",
      "payload": { "jobId": "job5" }
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": "job_selection"
}
```

**What User Sees:**
- Only jobs not yet applied to
- Each job as a clickable button
- Clear job information

---

## Scenario 6: Submitting Application

### User Action: Clicks "✅ React Developer"

**Backend Processing:**
```javascript
// Validate eligibility again
if (!profileComplete || !resumeUploaded) {
  return error;
}

// Check duplicate
if (appliedJobs.includes(jobId)) {
  return error;
}

// Create application
const application = await Application.create({
  job: 'job3',
  applicant: userId
});

// Update job
job.applications.push(application._id);
await job.save();
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Application submitted successfully!\n\nJob: React Developer\nCompany: Tech Corp\n\nGood luck! 🍀",
  "buttons": [
    {
      "label": "✅ Apply to Another Job",
      "action": "APPLY_JOB",
      "payload": {}
    },
    {
      "label": "📄 View My Applications",
      "action": "VIEW_APPLICATIONS",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- Confirmation message
- Job details
- Next action suggestions

---

## Scenario 7: All Jobs Applied

### User Action: Clicks "Apply for Jobs" again

**Backend Processing:**
```javascript
// Check eligible jobs
eligibleJobs = allJobs.filter(job => 
  !appliedJobs.includes(job._id.toString())
)

// Result: 0 jobs (all applied)
```

**Response:**
```json
{
  "success": true,
  "message": "✅ You've already applied to all available jobs!\n\nGreat work! Check back later for new opportunities.",
  "buttons": [
    {
      "label": "📄 My Applications",
      "action": "VIEW_APPLICATIONS",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- No job buttons shown
- Positive reinforcement
- Alternative actions provided

---

## Scenario 8: Viewing Applications

### User Action: Clicks "My Applications"

**Backend Processing:**
```javascript
const applications = await Application.find({ applicant: userId })
  .populate('job')
  .populate('job.company')
  .sort({ createdAt: -1 });

// Result: 3 applications
```

**Response:**
```json
{
  "success": true,
  "message": "📄 Your Applications (3):\n\n1. React Developer\n   🏢 Tech Corp\n   ⏳ PENDING\n\n2. Backend Developer\n   🏢 Code Inc\n   ✅ ACCEPTED\n\n3. Full Stack Developer\n   🏢 Dev Ltd\n   ❌ REJECTED",
  "buttons": [
    {
      "label": "💼 Browse More Jobs",
      "action": "BROWSE_JOBS",
      "payload": {}
    },
    {
      "label": "✅ Apply for Jobs",
      "action": "APPLY_JOB",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- All applications with status
- Visual indicators (emoji)
- Next actions available

---

## Scenario 9: Error Handling - Duplicate Application

### User Action: Tries to apply to already applied job (edge case)

**Backend Processing:**
```javascript
// Check if already applied
if (appliedJobs.includes(jobId)) {
  return error;
}
```

**Response:**
```json
{
  "success": false,
  "message": "❌ You have already applied to this job!",
  "buttons": [
    {
      "label": "💼 Browse Other Jobs",
      "action": "BROWSE_JOBS",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- Clear error message
- Recovery options
- No dead end

---

## Scenario 10: Browse Jobs as Guest

### User Action: Not logged in, clicks "Browse Jobs"

**Backend Processing:**
```javascript
// Fetch all active jobs
const jobs = await Job.find({ isActive: { $ne: false } })
  .limit(10)
  .populate('company');

// Note: User can view but not apply
```

**Response:**
```json
{
  "success": true,
  "message": "💼 Available Jobs (10):\n\n1. React Developer\n   🏢 Tech Corp\n   📍 Mumbai\n   💰 ₹12 LPA\n\n2. Backend Developer\n   🏢 Code Inc\n   📍 Bangalore\n   💰 ₹15 LPA\n\n...\n\n⚠️ Please login to apply for jobs.",
  "buttons": [
    {
      "label": "🔐 Login",
      "action": "LOGIN",
      "payload": {}
    },
    {
      "label": "📝 Sign Up",
      "action": "SIGNUP",
      "payload": {}
    },
    {
      "label": "🏠 Main Menu",
      "action": "MAIN_MENU",
      "payload": {}
    }
  ],
  "nextStep": null
}
```

**What User Sees:**
- Can view jobs
- Cannot apply (no apply buttons)
- Clear prompt to login

---

## Key Takeaways

1. **Backend Always Decides**: Every response based on real database state
2. **No Invalid Options**: Buttons only shown if action is valid
3. **Clear Feedback**: User always knows what's required
4. **Automatic Blocking**: Incomplete steps prevent next steps
5. **Error Recovery**: Every error provides way forward
6. **Progressive Workflow**: User guided step-by-step
7. **Data-Driven**: No hardcoded assumptions

## Testing Checklist

- [ ] Not logged in → Shows only Login, Signup, Browse
- [ ] Incomplete profile → Blocks apply, shows missing fields
- [ ] No resume → Blocks apply, shows upload option
- [ ] Fully qualified → Shows all features
- [ ] Already applied jobs → Filtered from apply list
- [ ] All jobs applied → Hides apply button, shows message
- [ ] Duplicate application → Prevented with error
- [ ] Network error → Handled gracefully
- [ ] Empty job list → Shows appropriate message
- [ ] Status updates → Applications show correct status
