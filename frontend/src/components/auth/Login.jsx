import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message, { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { duration: 2000 });
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleGoogleLogin = () => {
    if (!input.role) {
      toast.error("Please select a role (Candidate or Recruiter) first", {
        duration: 2000,
      });
      return;
    }
    window.location.href = `${USER_API_END_POINT}/auth/google?role=${input.role}`;
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#444444] dark:bg-[#121212]"
        >
          <div className="space-y-1 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
              Welcome back
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
              Sign in to your account
            </h1>
          </div>

          <div className="mt-5 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 dark:text-[#E0E0E0]">
                Email
              </Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@example.com"
                className="h-9 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888] transition-colors duration-200"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 dark:text-[#E0E0E0]">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="Enter your password"
                  className="h-9 pr-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888] transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#888888] dark:hover:text-[#B0B0B0]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700 dark:text-[#E0E0E0]">
                I am a
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "student" })}
                  variant="ghost"
                  className={`h-9 rounded-md border text-sm font-medium transition-all duration-200 ${
                    input.role === "student"
                      ? "border-gray-900 bg-gray-900 text-white dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] dark:hover:border-[#888888]"
                  }`}
                >
                  Candidate
                </Button>
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "recruiter" })}
                  variant="ghost"
                  className={`h-9 rounded-md border text-sm font-medium transition-all duration-200 ${
                    input.role === "recruiter"
                      ? "border-gray-900 bg-gray-900 text-white dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] dark:hover:border-[#888888]"
                  }`}
                >
                  Recruiter
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <Button className="mt-5 flex w-full h-9 items-center justify-center gap-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-black dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#888888] transition-all duration-200">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="mt-5 h-9 w-full rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-black dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#888888] transition-all duration-200"
            >
              Sign in
            </Button>
          )}

          {/* Divider */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-300 dark:border-[#444444]"></div>
            <span className="text-xs text-gray-500 dark:text-[#888888]">
              or
            </span>
            <div className="flex-1 border-t border-gray-300 dark:border-[#444444]"></div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 h-9 w-full rounded-md border border-gray-200 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0] dark:hover:bg-[#222222] dark:hover:border-[#666666] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-4 text-center text-xs text-gray-600 dark:text-[#888888]">
            <span>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-gray-900 hover:underline dark:text-[#E0E0E0]"
              >
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
