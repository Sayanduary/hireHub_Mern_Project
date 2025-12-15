import React, { useState, useMemo } from "react";
import {
  LogOut,
  User2,
  Moon,
  Sun,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "../ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { useTheme } from "../theme-provider";

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
    if (user?.role === "recruiter") {
      return [
        { label: "Companies", to: "/admin/companies" },
        { label: "Jobs", to: "/admin/jobs" },
      ];
    }
    return [
      { label: "Home", to: "/" },
      { label: "Jobs", to: "/jobs" },
    ];
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success("Logged out");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  const avatarInitials =
    user?.fullname
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-4 z-50">
      {/* Floating glass background */}
      <div
        className="
          absolute inset-0 mx-auto max-w-7xl
          rounded-2xl
          bg-gradient-to-r
          from-[#fffdf5]/80 via-[#fff8e7]/70 to-[#fffdf5]/80
          dark:from-black/70 dark:via-black/60 dark:to-black/70
          backdrop-blur-xl
          border border-black/5 dark:border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      />

      <div className="relative mx-auto max-w-7xl h-20 px-10 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-4 cursor-pointer"
        >
          <div className="h-10 w-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white dark:text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            SKILLIO
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                px-6 py-2.5 rounded-full
                text-base font-semibold
                transition-all
                ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
                }
              `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 rounded-full"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {/* Auth */}
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <button className="px-6 py-2.5 rounded-full text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10">
                  Sign in
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2.5 rounded-full text-base font-semibold bg-black text-white dark:bg-white dark:text-black">
                  Join now
                </button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer rounded-full border border-black/10 dark:border-white/10 hover:ring-2 hover:ring-black/10 dark:hover:ring-white/20 transition">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || ""}
                    alt={user?.fullname || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-semibold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72 rounded-xl p-0">
                <div className="p-4">
                  <div className="flex gap-3 pb-3 border-b">
                    <Avatar className="h-11 w-11 rounded-full border border-black/10 dark:border-white/10">
                      <AvatarImage
                        src={user?.profile?.profilePhoto || ""}
                        alt={user?.fullname || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black text-base font-semibold">
                        {avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.profile?.bio || "No bio"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 space-y-1">
                    {user?.role === "student" && (
                      <Link to="/profile">
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10">
                          <User2 className="h-4 w-4" />
                          Profile
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-10 w-10"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-xl border dark:border-white/10">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `
                  block px-5 py-3 rounded-xl
                  text-base font-semibold
                  ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "hover:bg-black/5 dark:hover:bg-white/10"
                  }
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
