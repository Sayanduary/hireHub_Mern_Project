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
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    profilePhoto: null,
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, profilePhoto: e.target.files?.[0] || null });
  };

  const handleGoogleSignup = () => {
    if (!input.role) {
      toast.error("Please select a role (Candidate or Recruiter) first", {
        duration: 2000,
      });
      return;
    }
    window.location.href = `${USER_API_END_POINT}/auth/google?role=${input.role}`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(); //formdata object
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message, { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { duration: 2000 });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Navbar />
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#121212]"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
              Get started
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
              Create your account
            </h1>
            <p className="text-sm text-gray-600 dark:text-[#B0B0B0]">
              Join our platform to find opportunities or hire talent
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                Full name
              </Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="John Doe"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                Email
              </Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="john@example.com"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                Phone number
              </Label>
              <Input
                type="text"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="+91 98765 43210"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                Password
              </Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Create a password"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888]"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                I am a
              </Label>
              <div className="grid gap-2">
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "student" })}
                  variant="ghost"
                  className={`h-10 rounded-md border transition-colors ${
                    input.role === "student"
                      ? "border-gray-900 bg-gray-900 text-white dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
                  }`}
                >
                  Candidate
                </Button>
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "recruiter" })}
                  variant="ghost"
                  className={`h-10 rounded-md border transition-colors ${
                    input.role === "recruiter"
                      ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-[#121212]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
                  }`}
                >
                  Recruiter
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#B0B0B0]">
                Profile image (optional)
              </Label>
              <div>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="h-10 cursor-pointer rounded-md border border-dashed border-gray-200 bg-white text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:file:bg-gray-100 dark:file:text-gray-900 dark:focus:border-gray-700"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-[#888888]">
                  PNG or JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <Button className="mt-8 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="mt-8 h-10 w-full rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200"
            >
              Create account
            </Button>
          )}

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300 dark:border-[#444444]"></div>
            <span className="text-xs text-gray-500 dark:text-[#888888]">
              or
            </span>
            <div className="flex-1 border-t border-gray-300 dark:border-[#444444]"></div>
          </div>

          {/* Google Sign Up Button */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            className="mt-6 h-10 w-full rounded-md border border-gray-200 bg-white text-gray-900 font-medium hover:bg-gray-50 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0] dark:hover:bg-[#222222] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Sign up with Google
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-[#888888]">
            <span>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-900 hover:underline dark:text-[#E0E0E0]"
              >
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
