import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    if (token && userId) {
      // Store token in cookie for axios requests
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

      // Set user data in Redux store
      const userData = {
        _id: userId,
        role: role,
        authProvider: "google",
      };
      dispatch(setUser(userData));
      toast.success("Logged in successfully!", { duration: 1500 });

      // Redirect based on role
      if (role === "recruiter") {
        navigate("/admin/companies");
      } else {
        navigate("/");
      }
    } else {
      toast.error("Authentication failed", { duration: 2000 });
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 dark:text-[#E0E0E0]" />
        </div>
        <p className="text-gray-600 dark:text-[#888888]">
          Completing your login...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
