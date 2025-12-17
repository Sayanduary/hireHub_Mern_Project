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
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
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
        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { duration: 1000 });
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Navbar />
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 shadow-sm dark:border-[#444444] dark:bg-[#121212]"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-600 dark:text-[#888888]">
              Continue your job search and manage applications
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                Email
              </Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@example.com"
                className="h-11 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888] transition-colors duration-200"
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
                placeholder="Enter your password"
                className="h-11 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] dark:focus:border-[#888888] transition-colors duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-[#E0E0E0]">
                I am a
              </Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "student" })}
                  variant="ghost"
                  className={`h-11 rounded-lg border-2 font-semibold transition-all duration-200 ${
                    input.role === "student"
                      ? "border-gray-900 bg-gray-900 text-white dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] scale-[1.02] shadow-sm"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] dark:hover:border-[#888888]"
                  }`}
                >
                  Candidate
                </Button>
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "recruiter" })}
                  variant="ghost"
                  className={`h-11 rounded-lg border-2 font-semibold transition-all duration-200 ${
                    input.role === "recruiter"
                      ? "border-gray-900 bg-gray-900 text-white dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] scale-[1.02] shadow-sm"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] dark:hover:border-[#888888]"
                  }`}
                >
                  Recruiter
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <Button className="mt-8 flex w-full h-12 items-center justify-center gap-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black shadow-sm dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#888888] transition-all duration-200">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="mt-8 h-12 w-full rounded-lg bg-gray-900 text-white font-semibold hover:bg-black hover:scale-[1.02] shadow-sm dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#888888] transition-all duration-200"
            >
              Sign in
            </Button>
          )}

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-[#888888]">
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
