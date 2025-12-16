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
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
    <div className="min-h-screen bg-[#F8F7F3] text-neutral-900 transition-colors dark:bg-[#0a0a0a] dark:text-neutral-100">
      <Navbar />
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg rounded-3xl border border-neutral-200/70 bg-white/80 p-8 shadow-none backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/90"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Career Console
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Welcome back
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to manage your search and stay in sync across devices.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Email
              </Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@studio.com"
                className="h-11 rounded-xl border border-neutral-200/80 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Password
              </Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="h-11 rounded-xl border border-neutral-200/80 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                I am a
              </Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "student" })}
                  variant="ghost"
                  className={`h-11 rounded-xl border transition-colors sm:h-12 ${
                    input.role === "student"
                      ? "border-neutral-900 bg-neutral-900 text-neutral-100 dark:border-white dark:bg-white dark:text-neutral-950"
                      : "border-neutral-200/70 text-neutral-600 hover:border-neutral-400 hover:bg-white/70 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/5"
                  }`}
                >
                  Student
                </Button>
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "recruiter" })}
                  variant="ghost"
                  className={`h-11 rounded-xl border transition-colors sm:h-12 ${
                    input.role === "recruiter"
                      ? "border-neutral-900 bg-neutral-900 text-neutral-100 dark:border-white dark:bg-white dark:text-neutral-950"
                      : "border-neutral-200/70 text-neutral-600 hover:border-neutral-400 hover:bg-white/70 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/5"
                  }`}
                >
                  Recruiter
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <Button className="mt-8 flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="mt-8 h-11 w-full rounded-xl bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
            >
              Continue
            </Button>
          )}

          <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              Need an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
              >
                Create one
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
