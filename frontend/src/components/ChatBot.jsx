import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT, JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '👋 Welcome to HireHub!\n\nI\'m your personal assistant to help you navigate through jobs, applications, and profile management.\n\nPlease select an option below:',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState({
    intent: null,
    step: null,
    data: {},
  });
  const [quickButtons, setQuickButtons] = useState([]);
  const [navigationStack, setNavigationStack] = useState(['main_menu']);
  
  const messagesEndRef = useRef(null);
  const { user } = useSelector((store) => store.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    showMainMenu();
  }, [user]);

  const addMessage = (text, type = 'bot', buttons = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // If buttons explicitly passed, use them
    // If null passed, it means buttons will be set separately
    // Never leave empty unless explicitly intended
    if (buttons !== null) {
      setQuickButtons(buttons);
    }
  };

  const showMainMenu = () => {
    setNavigationStack(['main_menu']);
    setConversationState({ intent: null, step: null, data: {} });
    
    if (!user) {
      setQuickButtons([
        { label: '🔐 Login / Signup', action: 'auth_menu' },
        { label: '💼 Browse Jobs', action: 'search_jobs' },
        { label: '❓ Help', action: 'help' },
      ]);
    } else if (user.role === 'student') {
      setQuickButtons([
        { label: '👤 Complete Profile', action: 'complete_profile' },
        { label: '💼 Browse Jobs', action: 'search_jobs' },
        { label: '✅ Apply for Jobs', action: 'apply_menu' },
        { label: '📄 My Applications', action: 'view_applications' },
        { label: '🚪 Logout', action: 'logout' },
      ]);
    } else if (user.role === 'recruiter') {
      setQuickButtons([
        { label: '👥 View Applicants', action: 'recruiter_action' },
        { label: '📝 Post Job', action: 'post_job' },
        { label: '🏢 Manage Companies', action: 'manage_companies' },
        { label: '🚪 Logout', action: 'logout' },
      ]);
    }
  };

  const addNavigationButtons = (customButtons = []) => {
    const navButtons = [];
    
    if (navigationStack.length > 1) {
      navButtons.push({ label: '⬅ Back', action: 'go_back' });
    }
    
    if (navigationStack[navigationStack.length - 1] !== 'main_menu') {
      navButtons.push({ label: '🏠 Main Menu', action: 'main_menu' });
    }
    
    setQuickButtons([...customButtons, ...navButtons]);
  };

  const navigateTo = (page) => {
    setNavigationStack(prev => [...prev, page]);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      const previousPage = newStack[newStack.length - 1];
      
      if (previousPage === 'main_menu') {
        showMainMenu();
      } else {
        // Handle going back to specific pages
        handleIntent(previousPage, previousPage);
      }
    }
  };

  const detectIntent = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Login intent
    if (input.includes('login') || input.includes('log in') || input.includes('sign in')) {
      return 'login';
    }
    
    // Signup intent
    if (input.includes('signup') || input.includes('sign up') || input.includes('register') || input.includes('create account')) {
      return 'signup';
    }
    
    // Profile completion intent
    if (input.includes('profile') || input.includes('complete profile') || input.includes('update profile')) {
      return 'complete_profile';
    }
    
    // Job search intent
    if (input.includes('job') || input.includes('search') || input.includes('find') || input.includes('show jobs')) {
      return 'search_jobs';
    }
    
    // Apply job intent
    if (input.includes('apply')) {
      return 'apply_job';
    }
    
    // View applications
    if (input.includes('my application') || input.includes('application status') || input.includes('applied jobs')) {
      return 'view_applications';
    }
    
    // Recruiter actions
    if (input.includes('applicant') || input.includes('candidate') || input.includes('accept') || input.includes('reject')) {
      return 'recruiter_action';
    }
    
    return null;
  };

  const handleIntent = async (intent, userInput) => {
    switch (intent) {
      case 'auth_menu':
        if (!user) {
          navigateTo('auth_menu');
          addMessage('Welcome! Please choose an option:', 'bot', []);
          addNavigationButtons([
            { label: '🔐 Login', action: 'login' },
            { label: '📝 Sign Up', action: 'signup' },
          ]);
        }
        break;

      case 'login':
        if (!user) {
          navigateTo('login');
          setConversationState({ intent: 'login', step: 'email', data: {} });
          addMessage('Great! Let me help you login.\n\nPlease type your email address below:', 'bot', []);
          addNavigationButtons([]);
        } else {
          addMessage(`You're already logged in as ${user.fullname}.`, 'bot', []);
          showMainMenu();
        }
        break;

      case 'signup':
        if (!user) {
          navigateTo('signup');
          setConversationState({ intent: 'signup', step: 'fullname', data: {} });
          addMessage('Let\'s create your account!\n\nPlease type your full name below:', 'bot', []);
          addNavigationButtons([]);
        } else {
          addMessage(`You're already registered and logged in.`, 'bot', []);
          showMainMenu();
        }
        break;

      case 'complete_profile':
        if (!user) {
          addMessage('❌ Please login first to update your profile.', 'bot', []);
          addNavigationButtons([
            { label: '🔐 Login', action: 'login' },
          ]);
        } else {
          navigateTo('complete_profile');
          await checkProfileCompletion();
        }
        break;

      case 'search_jobs':
        navigateTo('search_jobs');
        await searchJobs(userInput);
        break;

      case 'apply_menu':
        if (!user) {
          addMessage('❌ Please login first to apply for jobs.', 'bot', []);
          addNavigationButtons([
            { label: '🔐 Login', action: 'login' },
          ]);
        } else {
          navigateTo('apply_menu');
          await fetchJobsForApplication();
        }
        break;

      case 'view_applications':
        if (!user) {
          addMessage('❌ Please login first to view your applications.', 'bot', []);
          addNavigationButtons([
            { label: '🔐 Login', action: 'login' },
          ]);
        } else {
          navigateTo('view_applications');
          await viewApplications();
        }
        break;

      case 'recruiter_action':
        if (!user) {
          addMessage('❌ Please login first.', 'bot', []);
          addNavigationButtons([
            { label: '🔐 Login', action: 'login' },
          ]);
        } else if (user.role !== 'recruiter') {
          addMessage('❌ This feature is only available for recruiters.', 'bot', []);
          showMainMenu();
        } else {
          navigateTo('recruiter_action');
          addMessage('What would you like to do?', 'bot', []);
          addNavigationButtons([
            { label: '👥 View Applicants', action: 'view_applicants' },
            { label: '✅ Manage Applications', action: 'manage_apps' },
          ]);
        }
        break;

      case 'help':
        navigateTo('help');
        addMessage('🤝 How can I assist you?\n\nI can help you with:\n\n• 🔐 Login or create an account\n• 👤 Complete your profile\n• 💼 Browse and search jobs\n• ✅ Apply for jobs\n• 📄 View your application status\n\nSelect an option from the menu below:', 'bot', []);
        showMainMenu();
        break;

      default:
        addMessage('❌ I didn\'t understand that. Please select an option below:', 'bot', []);
        showMainMenu();
    }
  };

  const handleConversationFlow = async (userInput) => {
    const { intent, step, data } = conversationState;

    // Login flow
    if (intent === 'login') {
      if (step === 'email') {
        setConversationState({ ...conversationState, step: 'password', data: { ...data, email: userInput } });
        addMessage('Great! Now enter your password:', 'bot', []);
        addNavigationButtons([]);
      } else if (step === 'password') {
        setConversationState({ ...conversationState, step: 'role', data: { ...data, password: userInput } });
        addMessage('Are you a "student" or "recruiter"?', 'bot', [
          { label: '🎓 Student', action: 'role_student' },
          { label: '👔 Recruiter', action: 'role_recruiter' },
        ]);
      } else if (step === 'role') {
        await performLogin({ ...data, role: userInput });
      }
    }

    // Signup flow
    if (intent === 'signup') {
      if (step === 'fullname') {
        setConversationState({ ...conversationState, step: 'email', data: { ...data, fullname: userInput } });
        addMessage('Nice to meet you! What\'s your email address?', 'bot', []);
        addNavigationButtons([]);
      } else if (step === 'email') {
        setConversationState({ ...conversationState, step: 'phone', data: { ...data, email: userInput } });
        addMessage('Please provide your phone number:', 'bot', []);
        addNavigationButtons([]);
      } else if (step === 'phone') {
        setConversationState({ ...conversationState, step: 'password', data: { ...data, phoneNumber: userInput } });
        addMessage('Choose a strong password:', 'bot', []);
        addNavigationButtons([]);
      } else if (step === 'password') {
        setConversationState({ ...conversationState, step: 'role', data: { ...data, password: userInput } });
        addMessage('Are you registering as a "student" or "recruiter"?', 'bot', [
          { label: '🎓 Student', action: 'role_student' },
          { label: '👔 Recruiter', action: 'role_recruiter' },
        ]);
      } else if (step === 'role') {
        await performSignup({ ...data, role: userInput });
      }
    }

    // Apply job flow
    if (intent === 'apply_job' && step === 'job_id') {
      await applyForJob(userInput);
    }
  };

  const performLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, credentials, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        addMessage(`✅ Login successful!\n\nWelcome back, ${response.data.user.fullname}!`, 'bot', []);
        setConversationState({ intent: null, step: null, data: {} });
        showMainMenu();
      }
    } catch (error) {
      addMessage(`❌ Login failed: ${error.response?.data?.message || 'Invalid credentials'}\n\nPlease try again.`, 'bot', []);
      setConversationState({ intent: null, step: null, data: {} });
      addNavigationButtons([
        { label: '🔐 Try Again', action: 'login' },
        { label: '📝 Sign Up Instead', action: 'signup' },
      ]);
    }
    setIsLoading(false);
  };

  const performSignup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${USER_API_END_POINT}/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.data.success) {
        addMessage(`✅ Registration successful!\n\nWelcome, ${userData.fullname}!\n\nYou can now login to access all features.`, 'bot', []);
        setConversationState({ intent: null, step: null, data: {} });
        addNavigationButtons([
          { label: '🔐 Login Now', action: 'login' },
        ]);
      }
    } catch (error) {
      addMessage(`❌ Registration failed: ${error.response?.data?.message || 'Please try again'}`, 'bot', []);
      setConversationState({ intent: null, step: null, data: {} });
      addNavigationButtons([
        { label: '📝 Try Again', action: 'signup' },
        { label: '🔐 Login Instead', action: 'login' },
      ]);
    }
    setIsLoading(false);
  };

  const checkProfileCompletion = async () => {
    if (!user) return;
    
    const missingFields = [];
    if (!user.fullname) missingFields.push('Full Name');
    if (!user.phoneNumber) missingFields.push('Phone Number');
    if (!user.profile?.bio) missingFields.push('Bio');
    if (!user.profile?.skills || user.profile.skills.length === 0) missingFields.push('Skills');
    if (!user.profile?.resume) missingFields.push('Resume');

    if (missingFields.length === 0) {
      addMessage('✅ Your profile is complete!\n\nYou\'re all set to apply for jobs.', 'bot', []);
      addNavigationButtons([
        { label: '💼 Browse Jobs', action: 'search_jobs' },
        { label: '✅ Apply for Jobs', action: 'apply_menu' },
      ]);
    } else {
      addMessage(`⚠️ Your profile is incomplete.\n\nMissing fields:\n${missingFields.map(f => `• ${f}`).join('\n')}\n\nPlease complete your profile to apply for jobs.`, 'bot', []);
      addNavigationButtons([
        { label: '👤 Go to Profile', action: 'goto_profile' },
      ]);
    }
  };

  const fetchJobsForApplication = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/get`, {
        withCredentials: true,
      });
      
      if (response.data.success && response.data.jobs.length > 0) {
        const jobs = response.data.jobs.slice(0, 5);
        let jobsList = `💼 Select a job to apply:\n\n`;
        
        jobs.forEach((job, index) => {
          jobsList += `${index + 1}. ${job.title}\n   🏢 ${job.company?.name || 'N/A'}\n   📍 ${job.location}\n   💰 ₹${job.salary} LPA\n\n`;
        });
        
        addMessage(jobsList, 'bot', []);
        
        // Create buttons for each job
        const jobButtons = jobs.map((job) => ({
          label: `✅ Apply: ${job.title}`,
          action: `apply_job_${job._id}`
        }));
        
        addNavigationButtons(jobButtons);
      } else {
        addMessage('❌ No jobs available at the moment.\n\nPlease check back later.', 'bot', []);
        addNavigationButtons([
          { label: '🏠 Main Menu', action: 'main_menu' },
        ]);
      }
    } catch (error) {
      addMessage('❌ Failed to fetch jobs. Please try again.', 'bot', []);
      addNavigationButtons([
        { label: '🔁 Try Again', action: 'apply_menu' },
        { label: '🏠 Main Menu', action: 'main_menu' },
      ]);
    }
    setIsLoading(false);
  };

  const searchJobs = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/get`, {
        withCredentials: true,
      });
      
      if (response.data.success && response.data.jobs.length > 0) {
        const jobs = response.data.jobs.slice(0, 5);
        let jobsList = `📋 Found ${response.data.jobs.length} jobs!\n\nTop matches:\n\n`;
        
        jobs.forEach((job, index) => {
          jobsList += `${index + 1}. ${job.title}\n   🏢 ${job.company?.name || 'N/A'}\n   📍 ${job.location}\n   💰 ₹${job.salary} LPA\n\n`;
        });
        
        jobsList += '✅ This action is completed.\n\nWhat would you like to do next?';
        addMessage(jobsList, 'bot', []);
        
        addNavigationButtons([
          { label: '🔍 View More Jobs', action: 'search_jobs' },
          { label: '✅ Apply for Jobs', action: 'apply_menu' },
        ]);
      } else {
        addMessage('❌ No jobs found at the moment.\n\nPlease check back later.', 'bot', []);
        addNavigationButtons([
          { label: '🏠 Main Menu', action: 'main_menu' },
        ]);
      }
    } catch (error) {
      addMessage('❌ Failed to fetch jobs. Please try again.', 'bot', []);
      addNavigationButtons([
        { label: '🔍 Try Again', action: 'search_jobs' },
        { label: '🏠 Main Menu', action: 'main_menu' },
      ]);
    }
    setIsLoading(false);
  };

  const applyForJob = async (jobId) => {
    if (!user) {
      addMessage('Please login first to apply for jobs.', 'bot', []);
      addNavigationButtons([
        { label: '🔐 Login', action: 'login' },
      ]);
      return;
    }

    // Check profile completion
    const missingFields = [];
    if (!user.profile?.bio) missingFields.push('Bio');
    if (!user.profile?.skills || user.profile.skills.length === 0) missingFields.push('Skills');
    if (!user.profile?.resume) missingFields.push('Resume');

    if (missingFields.length > 0) {
      addMessage(`❌ Please complete your profile before applying for jobs.\n\nMissing:\n${missingFields.map(f => `• ${f}`).join('\n')}`, 'bot', []);
      setConversationState({ intent: null, step: null, data: {} });
      setQuickButtons([
        { label: '🔍 Browse Jobs', action: 'search_jobs' },
        { label: '⬅ Back', action: 'go_back' },
        { label: '🏠 Main Menu', action: 'main_menu' },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        addMessage('✅ Application submitted successfully!\n\nGood luck with your application.', 'bot', []);
        addNavigationButtons([
          { label: '📄 View Applications', action: 'view_applications' },
          { label: '🔍 Browse More Jobs', action: 'search_jobs' },
        ]);
      }
    } catch (error) {
      addMessage(`❌ ${error.response?.data?.message || 'Failed to apply. Please try again.'}`, 'bot', []);
      addNavigationButtons([
        { label: '🔍 Browse Jobs', action: 'search_jobs' },
        { label: '🏠 Main Menu', action: 'main_menu' },
      ]);
    }
    setIsLoading(false);
    setConversationState({ intent: null, step: null, data: {} });
  };

  const viewApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
        withCredentials: true,
      });
      
      if (response.data.success && response.data.applications.length > 0) {
        let appsList = `📄 You have ${response.data.applications.length} application(s):\n\n`;
        
        response.data.applications.slice(0, 5).forEach((app, index) => {
          const statusEmoji = app.status === 'accepted' ? '✅' : app.status === 'rejected' ? '❌' : '⏳';
          appsList += `${index + 1}. ${app.job?.title || 'N/A'}\n   🏢 ${app.job?.company?.name || 'N/A'}\n   ${statusEmoji} Status: ${app.status?.toUpperCase() || 'PENDING'}\n\n`;
        });
        
        appsList += '✅ This action is completed.\n\nWhat would you like to do next?';
        addMessage(appsList, 'bot', []);
        
        addNavigationButtons([
          { label: '🔍 View More Jobs', action: 'search_jobs' },
          { label: '✅ Apply for Jobs', action: 'apply_menu' },
        ]);
      } else {
        addMessage('📄 You haven\'t applied to any jobs yet.\n\nStart exploring opportunities!', 'bot', []);
        addNavigationButtons([
          { label: '💼 Browse Jobs', action: 'search_jobs' },
        ]);
      }
    } catch (error) {
      addMessage('❌ Failed to fetch your applications. Please try again.', 'bot', []);
      addNavigationButtons([
        { label: '🔁 Try Again', action: 'view_applications' },
        { label: '🏠 Main Menu', action: 'main_menu' },
      ]);
    }
    setIsLoading(false);
  };

  const handleButtonClick = async (action) => {
    // Handle job application button clicks
    if (action.startsWith('apply_job_')) {
      const jobId = action.replace('apply_job_', '');
      await applyForJob(jobId);
      return;
    }

    // Don't add message for navigation actions
    if (action !== 'go_back' && action !== 'main_menu') {
      addMessage(action.replace(/_/g, ' '), 'user');
    }
    
    setIsLoading(true);

    // Handle navigation actions
    if (action === 'go_back') {
      goBack();
      setIsLoading(false);
      return;
    }
    
    if (action === 'main_menu') {
      addMessage('🏠 Returning to main menu...');
      showMainMenu();
      setIsLoading(false);
      return;
    }

    // Handle special button actions
    if (action === 'role_student') {
      await handleConversationFlow('student');
    } else if (action === 'role_recruiter') {
      await handleConversationFlow('recruiter');
    } else if (action === 'logout') {
      try {
        await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
        addMessage('✅ Logged out successfully!\n\nSee you soon!', 'bot', []);
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        addMessage('❌ Logout failed. Please try again.', 'bot', []);
        addNavigationButtons([
          { label: '🔁 Try Again', action: 'logout' },
          { label: '🏠 Main Menu', action: 'main_menu' },
        ]);
      }
    } else if (action === 'goto_profile') {
      addMessage('✅ Redirecting to your profile page...', 'bot', []);
      setTimeout(() => window.location.href = '/profile/edit', 1000);
    } else {
      await handleIntent(action, action);
    }

    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    addMessage(userInput, 'user');
    setInput('');
    setIsLoading(true);

    // If in conversation flow, handle it
    if (conversationState.intent) {
      await handleConversationFlow(userInput);
    } else {
      // Detect new intent
      const intent = detectIntent(userInput);
      if (intent) {
        await handleIntent(intent, userInput);
      } else {
        addMessage('❌ I didn\'t understand that.\n\nPlease select an option from the buttons below:', 'bot', []);
        showMainMenu();
      }
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#121212]">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gray-900 px-4 py-3 text-white dark:bg-gray-100 dark:text-gray-900">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">HireHub Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Buttons */}
          {quickButtons.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {quickButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClick(button.action)}
                    disabled={isLoading}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use buttons above..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-300"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-gray-900 p-2 text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
