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
  }, [navigate, user]);
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-neutral-900 transition-colors dark:bg-[#0a0a0a] dark:text-neutral-100">
      <Navbar />
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl rounded-3xl border border-neutral-200/70 bg-white/80 p-8 shadow-none backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/90"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Join the network
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Create your profile
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Set up a workspace to apply, hire, and collaborate seamlessly.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Full name
              </Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="Jamie Rivera"
                className="h-11 rounded-xl border border-neutral-200/80 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Email
              </Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="jamie@studio.com"
                className="h-11 rounded-xl border border-neutral-200/80 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Phone number
              </Label>
              <Input
                type="text"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="+91 98765 43210"
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
                placeholder="Create a password"
                className="h-11 rounded-xl border border-neutral-200/80 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                I am a
              </Label>
              <div className="grid gap-2">
                <Button
                  type="button"
                  onClick={() => setInput({ ...input, role: "student" })}
                  variant="ghost"
                  className={`h-11 rounded-xl border transition-colors ${
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
                  className={`h-11 rounded-xl border transition-colors ${
                    input.role === "recruiter"
                      ? "border-neutral-900 bg-neutral-900 text-neutral-100 dark:border-white dark:bg-white dark:text-neutral-950"
                      : "border-neutral-200/70 text-neutral-600 hover:border-neutral-400 hover:bg-white/70 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/5"
                  }`}
                >
                  Recruiter
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Profile image (optional)
              </Label>
              <div>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="h-11 cursor-pointer rounded-xl border border-dashed border-neutral-200/80 bg-transparent text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:font-medium file:text-neutral-100 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:text-neutral-300 dark:file:bg-white dark:file:text-neutral-950 dark:focus:border-white/20"
                />
                <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                  PNG or JPG up to 5MB.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <Button className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="mt-8 h-11 w-full rounded-xl bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
            >
              Create account
            </Button>
          )}

          <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
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
