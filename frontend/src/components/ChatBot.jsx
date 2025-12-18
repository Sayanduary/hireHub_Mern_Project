import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CHATBOT_API_END_POINT } from "@/utils/constant";

/**
 * WORKFLOW-DRIVEN CHATBOT COMPONENT
 *
 * This chatbot is fully driven by backend logic:
 * - All decisions made by backend based on user state
 * - Only shows buttons that are valid for current user
 * - No assumptions or client-side logic for workflow
 * - Completely button-based navigation (minimal typing)
 */

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentButtons, setCurrentButtons] = useState([]);
  const [currentContext, setCurrentContext] = useState(null);

  const messagesEndRef = useRef(null);
  const { user } = useSelector((store) => store.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = useCallback((text, type = "bot") => {
    const newMessage = {
      id: Date.now() + Math.random(),
      type,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const sendMessageToBackend = useCallback(
    async (userMessage, context = null) => {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${CHATBOT_API_END_POINT}/message`,
          {
            user_message: userMessage,
            current_context: context,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          addMessage(response.data.message, "bot");
          setCurrentButtons(response.data.buttons || []);
          setCurrentContext(response.data.nextStep);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          addMessage(
            error.response.data?.message || "Please login to continue.",
            "bot"
          );
          setCurrentButtons(
            error.response.data?.buttons || [
              { label: "🔐 Login", action: "LOGIN", payload: {} },
              { label: "📝 Sign Up", action: "SIGNUP", payload: {} },
            ]
          );
        } else {
          addMessage("❌ An error occurred. Please try again.", "bot");
          setCurrentButtons([
            { label: "🔄 Retry", action: "MAIN_MENU", payload: {} },
          ]);
        }
      }

      setIsLoading(false);
    },
    [addMessage]
  );

  const initializeChatbot = useCallback(async () => {
    setMessages([]);
    setCurrentButtons([]);
    setCurrentContext(null);
    await sendMessageToBackend("start");
  }, [sendMessageToBackend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chatbot when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChatbot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initializeChatbot]);

  // Reinitialize when user changes
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      initializeChatbot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleButtonClick = async (button) => {
    // Add user's action to chat (show what button they clicked)
    const actionText = button.label
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
      .trim();
    addMessage(actionText, "user");

    // Handle special frontend-only actions
    if (button.action === "LOGIN") {
      addMessage("✅ Redirecting to login page...", "bot");
      setTimeout(() => (window.location.href = "/login"), 1000);
      return;
    }

    if (button.action === "SIGNUP") {
      addMessage("✅ Redirecting to signup page...", "bot");
      setTimeout(() => (window.location.href = "/signup"), 1000);
      return;
    }

    if (
      button.action === "COMPLETE_PROFILE" ||
      button.action === "EDIT_PROFILE"
    ) {
      addMessage("✅ Redirecting to profile page...", "bot");
      setTimeout(() => (window.location.href = "/profile/edit"), 1000);
      return;
    }

    if (button.action === "UPLOAD_RESUME") {
      addMessage("✅ Redirecting to profile page to upload resume...", "bot");
      setTimeout(() => (window.location.href = "/profile/edit"), 1000);
      return;
    }

    // For actions that need backend processing
    const actionMap = {
      MAIN_MENU: "main_menu",
      BROWSE_JOBS: "browse",
      APPLY_JOB: "apply",
      VIEW_APPLICATIONS: "application",
      VIEW_PROFILE: "profile",
      APPLY_TO_JOB: "apply_to_job",
    };

    const backendMessage =
      actionMap[button.action] || button.action.toLowerCase();

    // Include payload in context if present - check for jobId specifically
    let contextWithPayload = null;
    if (button.payload) {
      if (button.payload.jobId) {
        contextWithPayload = { jobId: button.payload.jobId };
      } else if (Object.keys(button.payload).length > 0) {
        contextWithPayload = { ...button.payload };
      }
    }

    await sendMessageToBackend(backendMessage, contextWithPayload);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    addMessage(userInput, "user");
    setInput("");

    await sendMessageToBackend(userInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-200 hover:scale-110"
          aria-label="Open chatbot"
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
              <div>
                <span
                  className="font-semibold block"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  HIREHUB ASSISTANT
                </span>
                <span className="text-xs opacity-75">Workflow-Driven</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Initializing assistant...</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    message.type === "user"
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Button Options */}
          {currentButtons.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700 max-h-[160px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {currentButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClick(button)}
                    disabled={isLoading}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
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
                placeholder="Or type a message..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-gray-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-300"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-gray-900 p-2 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Prefer using buttons for better experience
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
