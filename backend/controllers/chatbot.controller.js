import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

/**
 * WORKFLOW-DRIVEN CHATBOT CONTROLLER
 * 
 * STRICT RULES:
 * 1. NEVER assume anything
 * 2. Decide responses ONLY based on backend data
 * 3. NEVER show options that are invalid for the user
 * 4. ALWAYS return response in JSON format
 * 5. Generate BUTTON-BASED options only
 * 6. Guide user step-by-step until job apply is completed
 * 7. If a step is incomplete, block next steps automatically
 * 8. Backend logic has HIGHEST priority
 */

export const processMessage = async (req, res) => {
    try {
        const { user_message, current_context } = req.body;
        const userId = req.id; // From authentication middleware

        // Get user data from backend
        let userState = {
            isLoggedIn: false,
            profileComplete: false,
            resumeUploaded: false,
            appliedJobs: [],
            eligibleJobs: [],
            user: null
        };

        // If user is authenticated, fetch their complete state
        if (userId) {
            const user = await User.findById(userId)
                .select('-password')
                .populate({
                    path: 'profile.company',
                    select: 'name'
                });

            if (user) {
                userState.isLoggedIn = true;
                userState.user = user;

                // Check profile completion
                userState.profileComplete = checkProfileCompletion(user);

                // Check resume upload
                userState.resumeUploaded = !!(user.profile?.resume);

                // Get applied jobs
                const applications = await Application.find({ applicant: userId })
                    .select('job')
                    .lean();
                userState.appliedJobs = applications.map(app => app.job.toString());

                // Get eligible jobs (not already applied)
                const allJobs = await Job.find({ 
                    isActive: { $ne: false } 
                })
                    .populate('company', 'name')
                    .limit(20)
                    .lean();

                userState.eligibleJobs = allJobs
                    .filter(job => !userState.appliedJobs.includes(job._id.toString()))
                    .map(job => ({
                        id: job._id.toString(),
                        title: job.title,
                        company: job.company?.name || 'N/A',
                        location: job.location,
                        salary: job.salary,
                        experienceLevel: job.experienceLevel,
                        jobType: job.jobType
                    }));
            }
        }

        // Process workflow based on user state and message
        const response = await processWorkflow(user_message, userState, current_context);

        return res.status(200).json(response);

    } catch (error) {
        console.error('Chatbot error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
            buttons: [
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        });
    }
};

/**
 * Check if user profile is complete
 */
function checkProfileCompletion(user) {
    if (!user) return false;

    const requiredFields = {
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        bio: user.profile?.bio,
        skills: user.profile?.skills?.length > 0
    };

    return Object.values(requiredFields).every(field => !!field);
}

/**
 * Process workflow and return appropriate response
 */
async function processWorkflow(userMessage, userState, currentContext) {
    const message = (userMessage || '').toLowerCase().trim();

    // ===============================================
    // PRIORITY 1: APPLY TO SPECIFIC JOB (IMMEDIATE EXECUTION)
    // If jobId is in context, EXECUTE IMMEDIATELY - NO MENU
    // ===============================================
    if (message === 'apply_to_job' && currentContext?.jobId) {
        return await applyToJob(currentContext.jobId, userState);
    }

    // ===============================================
    // RULE 1: NOT LOGGED IN
    // ===============================================
    if (!userState.isLoggedIn) {
        // If user wants to browse jobs (read-only action allowed)
        if (message.includes('browse') || message.includes('job') || message === 'browse_jobs') {
            if (userState.eligibleJobs.length > 0) {
                const jobsList = userState.eligibleJobs.slice(0, 5).map((job, idx) => 
                    `${idx + 1}. ${job.title} at ${job.company} - ${job.location}`
                ).join('\n');

                return {
                    success: true,
                    message: `💼 Here are some available jobs:\n\n${jobsList}\n\n⚠️ Please login to apply for jobs.`,
                    buttons: [
                        {
                            label: "🔐 Login",
                            action: "LOGIN",
                            payload: {}
                        },
                        {
                            label: "📝 Sign Up",
                            action: "SIGNUP",
                            payload: {}
                        },
                        {
                            label: "🏠 Main Menu",
                            action: "MAIN_MENU",
                            payload: {}
                        }
                    ],
                    nextStep: null
                };
            } else {
                return {
                    success: true,
                    message: "No jobs available at the moment. Please check back later.",
                    buttons: [
                        {
                            label: "🏠 Main Menu",
                            action: "MAIN_MENU",
                            payload: {}
                        }
                    ],
                    nextStep: null
                };
            }
        }

        // Default: Show only login/signup
        return {
            success: true,
            message: "👋 Welcome to HireHub!\n\nPlease login or create an account to get started.",
            buttons: [
                {
                    label: "🔐 Login",
                    action: "LOGIN",
                    payload: {}
                },
                {
                    label: "📝 Sign Up",
                    action: "SIGNUP",
                    payload: {}
                },
                {
                    label: "💼 Browse Jobs (Guest)",
                    action: "BROWSE_JOBS",
                    payload: {}
                }
            ],
            nextStep: null
        };
    }

    // ===============================================
    // RULE 2: LOGGED IN BUT PROFILE INCOMPLETE
    // ===============================================
    if (!userState.profileComplete) {
        const missingFields = getMissingFields(userState.user);

        return {
            success: true,
            message: `⚠️ Your profile is incomplete!\n\nMissing fields:\n${missingFields.join('\n')}\n\n❌ You cannot apply for jobs until your profile is complete.`,
            buttons: [
                {
                    label: "👤 Complete Profile",
                    action: "COMPLETE_PROFILE",
                    payload: {}
                },
                {
                    label: "💼 Browse Jobs (View Only)",
                    action: "BROWSE_JOBS",
                    payload: {}
                },
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: "complete_profile"
        };
    }

    // ===============================================
    // RULE 3: PROFILE COMPLETE BUT NO RESUME
    // ===============================================
    if (!userState.resumeUploaded) {
        return {
            success: true,
            message: "⚠️ You haven't uploaded your resume yet!\n\n❌ Resume is required to apply for jobs.",
            buttons: [
                {
                    label: "📄 Upload Resume",
                    action: "UPLOAD_RESUME",
                    payload: {}
                },
                {
                    label: "💼 Browse Jobs (View Only)",
                    action: "BROWSE_JOBS",
                    payload: {}
                },
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: "upload_resume"
        };
    }

    // ===============================================
    // RULE 4: FULLY QUALIFIED - PROCESS INTENT
    // ===============================================

    // Main Menu
    if (message === 'main_menu' || message === 'menu' || message === 'start') {
        return getMainMenu(userState);
    }

    // Apply for Jobs
    if (message.includes('apply') || message === 'apply_job') {
        if (userState.eligibleJobs.length === 0) {
            const hasApplied = userState.appliedJobs.length > 0;
            return {
                success: true,
                message: hasApplied 
                    ? "✅ You've already applied to all available jobs!\n\nGreat work! Check back later for new opportunities."
                    : "No jobs available for application at the moment.",
                buttons: [
                    {
                        label: "📄 My Applications",
                        action: "VIEW_APPLICATIONS",
                        payload: {}
                    },
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        // Show eligible jobs with apply buttons
        const jobButtons = userState.eligibleJobs.slice(0, 5).map(job => ({
            label: `✅ ${job.title}`,
            action: "APPLY_TO_JOB",
            payload: { jobId: job.id }
        }));

        const jobsList = userState.eligibleJobs.slice(0, 5).map((job, idx) => 
            `${idx + 1}. ${job.title}\n   🏢 ${job.company}\n   📍 ${job.location}\n   💰 ₹${job.salary} LPA`
        ).join('\n\n');

        return {
            success: true,
            message: `💼 Here are jobs you can apply to:\n\n${jobsList}\n\nSelect a job to apply:`,
            buttons: [
                ...jobButtons,
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: "job_selection"
        };
    }

    // View Applications
    if (message.includes('application') || message === 'view_applications') {
        return await getApplications(userState.user._id);
    }

    // Browse Jobs
    if (message.includes('browse') || message.includes('search')) {
        return await browseJobs(userState);
    }

    // Profile
    if (message.includes('profile')) {
        return {
            success: true,
            message: `👤 Your Profile:\n\n✅ Name: ${userState.user.fullname}\n✅ Email: ${userState.user.email}\n✅ Phone: ${userState.user.phoneNumber}\n✅ Bio: ${userState.user.profile?.bio || 'N/A'}\n✅ Skills: ${userState.user.profile?.skills?.join(', ') || 'N/A'}\n✅ Resume: ${userState.resumeUploaded ? 'Uploaded ✓' : 'Not Uploaded ✗'}`,
            buttons: [
                {
                    label: "✏️ Edit Profile",
                    action: "EDIT_PROFILE",
                    payload: {}
                },
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        };
    }

    // Default: Main Menu
    return getMainMenu(userState);
}

/**
 * Get main menu based on user state
 */
function getMainMenu(userState) {
    if (!userState.isLoggedIn) {
        return {
            success: true,
            message: "👋 Welcome to HireHub!\n\nWhat would you like to do?",
            buttons: [
                {
                    label: "🔐 Login",
                    action: "LOGIN",
                    payload: {}
                },
                {
                    label: "📝 Sign Up",
                    action: "SIGNUP",
                    payload: {}
                },
                {
                    label: "💼 Browse Jobs",
                    action: "BROWSE_JOBS",
                    payload: {}
                }
            ],
            nextStep: null
        };
    }

    const buttons = [];

    // Always show these
    buttons.push({
        label: "💼 Browse Jobs",
        action: "BROWSE_JOBS",
        payload: {}
    });

    // Only show if profile complete and resume uploaded
    if (userState.profileComplete && userState.resumeUploaded) {
        buttons.push({
            label: "✅ Apply for Jobs",
            action: "APPLY_JOB",
            payload: {}
        });
        buttons.push({
            label: "📄 My Applications",
            action: "VIEW_APPLICATIONS",
            payload: {}
        });
    } else if (!userState.profileComplete) {
        buttons.push({
            label: "👤 Complete Profile (Required)",
            action: "COMPLETE_PROFILE",
            payload: {}
        });
    } else if (!userState.resumeUploaded) {
        buttons.push({
            label: "📄 Upload Resume (Required)",
            action: "UPLOAD_RESUME",
            payload: {}
        });
    }

    buttons.push({
        label: "👤 View Profile",
        action: "VIEW_PROFILE",
        payload: {}
    });

    return {
        success: true,
        message: `👋 Hello, ${userState.user.fullname}!\n\nWhat would you like to do today?`,
        buttons: buttons,
        nextStep: null
    };
}

/**
 * Get missing profile fields
 */
function getMissingFields(user) {
    const missing = [];
    if (!user.fullname) missing.push('• Full Name');
    if (!user.email) missing.push('• Email');
    if (!user.phoneNumber) missing.push('• Phone Number');
    if (!user.profile?.bio) missing.push('• Bio');
    if (!user.profile?.skills || user.profile.skills.length === 0) missing.push('• Skills');
    return missing;
}

/**
 * Apply to a specific job
 */
async function applyToJob(jobId, userState) {
    try {
        
        // Double check eligibility
        if (!userState.profileComplete || !userState.resumeUploaded) {
            return {
                success: false,
                message: "❌ You cannot apply. Please complete your profile and upload your resume first.",
                buttons: [
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        // Check if already applied
        if (userState.appliedJobs.includes(jobId)) {
            return {
                success: false,
                message: "❌ You have already applied to this job!",
                buttons: [
                    {
                        label: "💼 Browse Other Jobs",
                        action: "BROWSE_JOBS",
                        payload: {}
                    },
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        // Get job details
        const job = await Job.findById(jobId).populate('company', 'name');
        if (!job) {
            return {
                success: false,
                message: "❌ Job not found or no longer available.",
                buttons: [
                    {
                        label: "💼 Browse Jobs",
                        action: "BROWSE_JOBS",
                        payload: {}
                    },
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: userState.user._id
        });

        if (application) {
            // Update job with new application
            job.applications.push(application._id);
            await job.save();

            return {
                success: true,
                message: `✅ Application submitted successfully!\n\nJob: ${job.title}\nCompany: ${job.company?.name || 'N/A'}\n\nGood luck! 🍀`,
                buttons: [
                    {
                        label: "✅ Apply to Another Job",
                        action: "APPLY_JOB",
                        payload: {}
                    },
                    {
                        label: "📄 View My Applications",
                        action: "VIEW_APPLICATIONS",
                        payload: {}
                    },
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        return {
            success: false,
            message: "❌ Failed to submit application. Please try again.",
            buttons: [
                {
                    label: "🔄 Try Again",
                    action: "APPLY_JOB",
                    payload: {}
                },
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        };

    } catch (error) {
        console.error('Apply job error:', error);
        return {
            success: false,
            message: "❌ An error occurred while applying. Please try again.",
            buttons: [
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        };
    }
}

/**
 * Get user's applications
 */
async function getApplications(userId) {
    try {
        const applications = await Application.find({ applicant: userId })
            .populate({
                path: 'job',
                select: 'title location salary company',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!applications || applications.length === 0) {
            return {
                success: true,
                message: "📄 You haven't applied to any jobs yet.\n\nStart exploring opportunities!",
                buttons: [
                    {
                        label: "💼 Browse Jobs",
                        action: "BROWSE_JOBS",
                        payload: {}
                    },
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        const appsList = applications.slice(0, 10).map((app, idx) => {
            const status = app.status || 'pending';
            const emoji = status === 'accepted' ? '✅' : status === 'rejected' ? '❌' : '⏳';
            const jobTitle = app.job?.title || 'Job Deleted';
            const companyName = app.job?.company?.name || 'Company N/A';
            return `${idx + 1}. ${jobTitle}\n   🏢 ${companyName}\n   ${emoji} ${status.toUpperCase()}`;
        }).join('\n\n');

        return {
            success: true,
            message: `📄 Your Applications (${applications.length}):\n\n${appsList}`,
            buttons: [
                {
                    label: "💼 Browse More Jobs",
                    action: "BROWSE_JOBS",
                    payload: {}
                },
                {
                    label: "✅ Apply for Jobs",
                    action: "APPLY_JOB",
                    payload: {}
                },
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        };

    } catch (error) {
        console.error('Get applications error:', error);
        return {
            success: false,
            message: "❌ Failed to fetch your applications. Please try again.",
            buttons: [
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        };
    }
}

/**
 * Browse available jobs
 */
async function browseJobs(userState) {
    try {
        const jobs = userState.isLoggedIn ? userState.eligibleJobs : [];

        // If not logged in, fetch all jobs
        if (!userState.isLoggedIn) {
            const allJobs = await Job.find({ isActive: { $ne: false } })
                .populate('company', 'name')
                .limit(10)
                .lean();

            jobs.push(...allJobs.map(job => ({
                id: job._id.toString(),
                title: job.title,
                company: job.company?.name || 'N/A',
                location: job.location,
                salary: job.salary
            })));
        }

        if (jobs.length === 0) {
            return {
                success: true,
                message: "No jobs available at the moment. Please check back later!",
                buttons: [
                    {
                        label: "🏠 Main Menu",
                        action: "MAIN_MENU",
                        payload: {}
                    }
                ],
                nextStep: null
            };
        }

        const jobsList = jobs.slice(0, 10).map((job, idx) => 
            `${idx + 1}. ${job.title}\n   🏢 ${job.company}\n   📍 ${job.location}\n   💰 ₹${job.salary} LPA`
        ).join('\n\n');

        const buttons = [];

        if (userState.isLoggedIn && userState.profileComplete && userState.resumeUploaded) {
            buttons.push({
                label: "✅ Apply for Jobs",
                action: "APPLY_JOB",
                payload: {}
            });
        }

        buttons.push({
            label: "🏠 Main Menu",
            action: "MAIN_MENU",
            payload: {}
        });

        return {
            success: true,
            message: `💼 Available Jobs (${jobs.length}):\n\n${jobsList}`,
            buttons: buttons,
            nextStep: null
        };

    } catch (error) {
        console.error('Browse jobs error:', error);
        return {
            success: false,
            message: "❌ Failed to fetch jobs. Please try again.",
            buttons: [
                {
                    label: "🏠 Main Menu",
                    action: "MAIN_MENU",
                    payload: {}
                }
            ],
            nextStep: null
        };
    }
}
