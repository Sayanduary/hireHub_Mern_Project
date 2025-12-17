import React, { useState, useMemo } from "react";
import { LogOut, User2, Moon, Sun, Menu, X } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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
        { label: "About", to: "/about" },
      ];
    }
    return [
      { label: "Home", to: "/" },
      { label: "Jobs", to: "/jobs" },
      { label: "About", to: "/about" },
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
        toast.success("Logged out", { duration: 1200 });
      }
    } catch {
      toast.error("Logout failed", { duration: 1200 });
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md dark:bg-[#121212]/80 dark:border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
            <video
              src="/logo.webm"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            HIREHUB
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-[#3362d3] text-white dark:bg-gray-100 dark:text-[#121212]"
                    : "text-gray-600 hover:text-[#3362d3] hover:bg-transparent dark:text-[#b0b0b0] dark:hover:text-white dark:hover:bg-[#1a1a1a]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Auth */}
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-md text-[#3362d3] hover:bg-[#3362d3]/10 dark:text-[#b0b0b0] dark:hover:bg-[#1a1a1a]"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium rounded-md bg-[#3362d3] text-white hover:bg-[#2851b8] dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer border dark:border-[#2a2a2a]">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || ""}
                    alt={user?.fullname}
                  />
                  <AvatarFallback className="text-sm font-semibold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-0 rounded-lg border dark:border-[#2a2a2a]">
                <div className="p-4">
                  <div className="flex gap-3 pb-3 border-b dark:border-[#2a2a2a]">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profile?.profilePhoto || ""} />
                      <AvatarFallback>{avatarInitials}</AvatarFallback>
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
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                    >
                      <User2 className="h-4 w-4" />
                      View profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-9 w-9"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white dark:bg-[#121212] dark:border-[#2a2a2a]">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-sm font-medium
                  ${
                    isActive
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-[#121212]"
                      : "text-gray-600 hover:bg-gray-100 dark:text-[#b0b0b0] dark:hover:bg-[#1a1a1a]"
                  }`
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
