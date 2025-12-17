import React, { useState, useMemo } from "react";
import { LogOut, User2, Moon, Sun, Briefcase, Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800/50 dark:bg-[#0a0a0a]/95 transition-colors">
      <div className="relative w-full h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-9 w-9 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <Briefcase className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            HIREHUB
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                px-4 py-2 rounded-lg
                text-sm font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                }
              `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-all duration-200"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Auth */}
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Sign in
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors">
                  Sign up
                </button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || ""}
                    alt={user?.fullname || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs font-semibold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-64 rounded-lg p-0 border-gray-200 dark:border-gray-800">
                <div className="p-4">
                  <div className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                    <Avatar className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700">
                      <AvatarImage
                        src={user?.profile?.profilePhoto || ""}
                        alt={user?.fullname || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-sm font-semibold">
                        {avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.profile?.bio || "No bio"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 space-y-1">
                    <Link to="/profile">
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <User2 className="h-4 w-4" />
                        View profile
                      </button>
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
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
            className="md:hidden h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="p-4 space-y-1 max-w-7xl mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `
                  block px-4 py-2 rounded-md
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
            {!user && (
              <div className="pt-2 space-y-1 border-t border-gray-200 dark:border-gray-800 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Sign in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <button className="w-full text-left px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
