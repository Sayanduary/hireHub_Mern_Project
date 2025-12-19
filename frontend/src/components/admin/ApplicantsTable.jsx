import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { X, Mail, Phone, MapPin, Briefcase, FileText, Linkedin, Github, Calendar, CheckCircle, XCircle, Search, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  APPLICATION_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import axios from "axios";
import { setAllApplicants } from "@/redux/applicationSlice";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Refs for dropdown behavior
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdown]);
  
  // Handler for mouse enter - cancel any pending close
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Handler for mouse leave - close with delay
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message, { duration: 1000 });

        // Update the local state to reflect the change
        const updatedApplicants = {
          ...applicants,
          applications: applicants.applications.map((app) =>
            app._id === id ? { ...app, status: status.toLowerCase() } : app
          ),
        };
        dispatch(setAllApplicants(updatedApplicants));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status", { duration: 1000 });
    }
  };

  const maskEmail = (email) => {
    if (!email) return "***@***.com";
    const [username, domain] = email.split("@");
    return `${username.slice(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "****";
    return `******${phone.toString().slice(-2)}`;
  };

  const openCandidateDrawer = (candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const closeCandidateDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCandidate(null), 300);
  };

  const handleStatusChange = async (status, applicationId) => {
    try {
      await statusHandler(status, applicationId);
      closeCandidateDrawer();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Filter and search logic
  const filteredApplicants = useMemo(() => {
    if (!applicants?.applications) return [];
    
    let filtered = [...applicants.applications];
    
    // Search filter
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((item) => {
        const fullname = item?.applicant?.fullname?.toLowerCase() || "";
        const email = item?.applicant?.email?.toLowerCase() || "";
        const location = item?.applicant?.profile?.location?.toLowerCase() || "";
        
        return fullname.includes(searchLower) || 
               email.includes(searchLower) || 
               location.includes(searchLower);
      });
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item?.status === statusFilter);
    }
    
    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((item) => {
        const appliedDate = new Date(item?.createdAt);
        
        if (dateFilter === "today") {
          return appliedDate.toDateString() === now.toDateString();
        } else if (dateFilter === "last7days") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return appliedDate >= sevenDaysAgo;
        } else if (dateFilter === "custom" && customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return appliedDate >= start && appliedDate <= end;
        }
        
        return true;
      });
    }
    
    return filtered;
  }, [applicants, debouncedSearch, statusFilter, dateFilter, customStartDate, customEndDate]);

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-[#444444] bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Input - Left Side */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:placeholder:text-[#888888] transition-colors"
              aria-label="Search applicants"
            />
          </div>
          
          {/* Filter Controls - Right Side */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <div 
              className="relative"
              ref={openDropdown === 'status' ? dropdownRef : null}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                className="h-9 px-3 text-sm font-normal border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] rounded-md focus:border-gray-400 focus-visible:ring-0 transition-colors inline-flex items-center justify-center"
                aria-label="Filter by status"
              >
                Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'status' ? "rotate-180" : ""}`} />
              </button>
              
              {openDropdown === 'status' && (
                <div 
                  className="absolute top-full left-0 pt-2 w-56 z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="rounded-md border border-gray-200 bg-white shadow-lg dark:border-[#444444] dark:bg-[#121212]">
                  <div className="p-3">
                    <div className="space-y-2">
                      {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            statusFilter === status
                              ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-[#E0E0E0] font-medium'
                              : 'text-gray-700 dark:text-[#B0B0B0] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50'
                          }`}
                        >
                          {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Date Filter */}
            <div 
              className="relative"
              ref={openDropdown === 'date' ? dropdownRef : null}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                className="h-9 px-3 text-sm font-normal border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] rounded-md focus:border-gray-400 focus-visible:ring-0 transition-colors inline-flex items-center justify-center"
                aria-label="Filter by date"
              >
                Date: {dateFilter === 'all' ? 'All Time' : dateFilter === 'last7days' ? 'Last 7 Days' : dateFilter === 'today' ? 'Today' : 'Custom'}
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'date' ? "rotate-180" : ""}`} />
              </button>
              
              {openDropdown === 'date' && (
                <div 
                  className="absolute top-full left-0 pt-2 w-56 z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="rounded-md border border-gray-200 bg-white shadow-lg dark:border-[#444444] dark:bg-[#121212]">
                    <div className="p-3">
                      <div className="space-y-2">
                        {['all', 'today', 'last7days', 'custom'].map((date) => (
                          <button
                            key={date}
                            onClick={() => {
                              setDateFilter(date);
                              if (date !== 'custom') {
                                setOpenDropdown(null);
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              dateFilter === date
                                ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-[#E0E0E0] font-medium'
                                : 'text-gray-700 dark:text-[#B0B0B0] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50'
                            }`}
                          >
                            {date === 'all' ? 'All Time' : date === 'last7days' ? 'Last 7 Days' : date === 'today' ? 'Today' : 'Custom Range'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Custom Date Range - Conditional */}
            {dateFilter === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-9 px-3 text-sm border border-gray-300 bg-white text-gray-700 rounded-md focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] transition-colors"
                  aria-label="Start date"
                />
                <span className="text-gray-500 dark:text-[#888888]">—</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="h-9 px-3 text-sm border border-gray-300 bg-white text-gray-700 rounded-md focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] transition-colors"
                  aria-label="End date"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(debouncedSearch || statusFilter !== "all" || dateFilter !== "all") && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-[#888888]">
            <span className="font-medium">Active filters:</span>
            {debouncedSearch && (
              <span className="px-2 py-1 bg-gray-900 dark:bg-gray-900/30 text-white dark:text-gray-400 rounded-md">
                Search: "{debouncedSearch}"
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md capitalize">
                Status: {statusFilter}
              </span>
            )}
            {dateFilter !== "all" && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md capitalize">
                Date: {dateFilter === "custom" ? `${customStartDate} to ${customEndDate}` : dateFilter.replace("last7days", "Last 7 Days")}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setDebouncedSearch("");
                setStatusFilter("all");
                setDateFilter("all");
                setCustomStartDate("");
                setCustomEndDate("");
              }}
              className="ml-2 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-[#888888] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      
      <Table>
        <TableCaption>
          {filteredApplicants.length > 0 
            ? `Showing ${filteredApplicants.length} of ${applicants?.applications?.length || 0} applicants`
            : "No applicants found"}
        </TableCaption>
        <TableHeader>
          <TableRow className="border-b border-gray-200 dark:border-[#444444]">
            <TableHead className="text-center font-semibold text-sm text-gray-900 dark:text-[#E0E0E0]">Full Name</TableHead>
            <TableHead className="text-center font-semibold text-sm text-gray-900 dark:text-[#E0E0E0]">Email</TableHead>
            <TableHead className="text-center font-semibold text-sm text-gray-900 dark:text-[#E0E0E0]">Contact</TableHead>
            <TableHead className="text-center font-semibold text-sm text-gray-900 dark:text-[#E0E0E0]">Location</TableHead>
            <TableHead className="text-center font-semibold text-sm text-gray-900 dark:text-[#E0E0E0]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplicants.length > 0 ? (
            filteredApplicants.map((item) => {
              const isAccepted = item?.status === "accepted";
              return (
                <tr key={item._id} className="border-b border-gray-100 dark:border-[#444444]/30 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                  <TableCell className="py-1.5 px-3 font-medium text-sm text-center text-gray-900 dark:text-[#E0E0E0]">
                    {item?.applicant?.fullname}
                  </TableCell>
                  <TableCell className="py-1.5 px-2 text-sm text-center">
                    {isAccepted ? (
                      <span className="text-gray-700 dark:text-[#B0B0B0]">{item?.applicant?.email}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-[#888888]">{maskEmail(item?.applicant?.email)}</span>
                    )}
                  </TableCell>
                  <TableCell className="py-1.5 px-2 text-sm text-center">
                    {isAccepted ? (
                      <span className="text-gray-700 dark:text-[#B0B0B0]">{item?.applicant?.phoneNumber}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-[#888888]">{maskPhone(item?.applicant?.phoneNumber)}</span>
                    )}
                  </TableCell>
                  <TableCell className="py-1.5 px-2 text-sm text-center text-gray-600 dark:text-[#B0B0B0]">
                    {item?.applicant?.profile?.location || <span className="text-gray-400 dark:text-[#666666]">—</span>}
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        className={`text-xs px-2 py-0.5 ${
                          item?.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {item?.status?.toUpperCase() || "PENDING"}
                      </Badge>
                      <Button
                        onClick={() => openCandidateDrawer(item)}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-gray-900 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-900/20"
                      >
                        View More
                      </Button>
                    </div>
                  </TableCell>
                </tr>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-gray-400 dark:text-[#666666]">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1">
                      No applicants found
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#888888]">
                      {debouncedSearch || statusFilter !== "all" || dateFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "No candidates have applied yet"}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Candidate Detail Drawer */}
      {isDrawerOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={closeCandidateDrawer}
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-2xl transform transition-transform">
              <div className="flex h-full flex-col bg-white dark:bg-[#121212] shadow-xl">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-[#444444]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-[#E0E0E0]">
                      Candidate Details
                    </h2>
                    <button
                      onClick={closeCandidateDrawer}
                      className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-[#1a1a1a] dark:hover:text-[#B0B0B0]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-8">
                    {/* Basic Info */}
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-[#888888]">
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-[#888888]">Full Name</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                              {selectedCandidate.applicant.fullname}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-[#888888]">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                              {selectedCandidate.status === "accepted" 
                                ? selectedCandidate.applicant.email 
                                : maskEmail(selectedCandidate.applicant.email)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-[#888888]">Phone</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                              {selectedCandidate.status === "accepted" 
                                ? selectedCandidate.applicant.phoneNumber 
                                : maskPhone(selectedCandidate.applicant.phoneNumber)}
                            </p>
                          </div>
                        </div>
                        {selectedCandidate.applicant.profile?.location && (
                          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 dark:text-[#888888]">Location</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                                {selectedCandidate.applicant.profile.location}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-[#888888]">
                        Professional Details
                      </h3>
                      <div className="space-y-4">
                        {selectedCandidate.applicant.profile?.skills?.length > 0 && (
                          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                            <p className="mb-2 text-xs text-gray-500 dark:text-[#888888]">Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedCandidate.applicant.profile.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block rounded-md bg-white border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:bg-[#121212] dark:border-[#444444] dark:text-[#B0B0B0]"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedCandidate.applicant.profile?.bio && (
                          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                            <p className="mb-2 text-xs text-gray-500 dark:text-[#888888]">Bio / Summary</p>
                            <p className="text-sm text-gray-700 dark:text-[#B0B0B0]">
                              {selectedCandidate.applicant.profile.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Documents & Links */}
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-[#888888]">
                        Documents & Links
                      </h3>
                      <div className="space-y-3">
                        {selectedCandidate.applicant.profile?.resume && (
                          <a
                            href={`${USER_API_END_POINT}/download-resume/${selectedCandidate.applicant._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:border-[#444444] dark:bg-[#1a1a1a] dark:hover:bg-[#222222]"
                          >
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                View Resume
                              </p>
                            </div>
                          </a>
                        )}
                        {selectedCandidate.applicant.profile?.linkedinUrl && (
                          <a
                            href={selectedCandidate.applicant.profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:border-[#444444] dark:bg-[#1a1a1a] dark:hover:bg-[#222222]"
                          >
                            <Linkedin className="h-4 w-4 text-gray-900 dark:text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                                LinkedIn Profile
                              </p>
                            </div>
                          </a>
                        )}
                        {selectedCandidate.applicant.profile?.githubUrl && (
                          <a
                            href={selectedCandidate.applicant.profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:border-[#444444] dark:bg-[#1a1a1a] dark:hover:bg-[#222222]"
                          >
                            <Github className="h-4 w-4 text-gray-700 dark:text-[#B0B0B0]" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                                GitHub Profile
                              </p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Application Info */}
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-[#888888]">
                        Application Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-[#888888]">Applied Date</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                              {selectedCandidate.applicant.createdAt.split("T")[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-[#888888]">Current Status</p>
                            <div className="mt-1">
                              <Badge
                                className={`${
                                  selectedCandidate.status === "rejected"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : selectedCandidate.status === "pending"
                                    ? "bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-[#B0B0B0]"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                }`}
                              >
                                {selectedCandidate.status?.toUpperCase() || "PENDING"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-[#444444] dark:bg-[#0a0a0a]">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleStatusChange("Accepted", selectedCandidate._id)}
                      disabled={selectedCandidate.status === "accepted"}
                      className="flex-1 gap-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleStatusChange("Rejected", selectedCandidate._id)}
                      disabled={selectedCandidate.status === "rejected"}
                      variant="outline"
                      className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 disabled:border-gray-200 disabled:text-gray-400 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantsTable;
