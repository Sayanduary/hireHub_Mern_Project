import { useEffect, useMemo, useState, useRef } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobSlice";
import { Search, ChevronDown, X, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi NCR",
      "Bangalore",
      "Hyderabad",
      "Pune",
      "Mumbai",
      "Chennai",
      "Kolkata",
      "Ahmedabad",
    ],
  },
  {
    filterType: "Industry",
    array: [
      "IT",
      "Finance",
      "Healthcare",
      "E-commerce",
      "Manufacturing",
      "Retail",
      "Education",
    ],
  },
  {
    filterType: "Job Type",
    array: ["Full-time", "Part-time", "Contract", "Temporary", "Freelance"],
  },
  {
    filterType: "Experience Level",
    array: ["Fresher", "1-2 Years", "2-5 Years", "5-10 Years", "10+ Years"],
  },
  {
    filterType: "Salary Range",
    array: ["0-40k", "40k-1lakh", "1lakh-5lakh", "5lakh-10lakh", "10lakh+"],
  },
];

const skillsData = [
  "Python",
  "JavaScript",
  "Java",
  "SQL",
  "AWS",
  "React",
  "Node.js",
  "Docker",
  "Kubernetes",
  "Excel",
  "Git",
  "Azure",
  "Data Analysis",
  "Power BI",
  "C++",
  "C#",
  ".NET",
  "Spring",
  "Django",
  "Flask",
];

const FilterCard = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (selectedLocation)
      chips.push({ type: "location", label: selectedLocation });
    if (selectedIndustry)
      chips.push({ type: "industry", label: selectedIndustry });
    if (selectedJobType)
      chips.push({ type: "jobType", label: selectedJobType });
    if (selectedExperience)
      chips.push({ type: "experience", label: selectedExperience });
    if (selectedSalary) chips.push({ type: "salary", label: selectedSalary });
    selectedSkills.forEach((skill) =>
      chips.push({ type: "skill", label: skill })
    );
    return chips;
  }, [
    selectedLocation,
    selectedIndustry,
    selectedJobType,
    selectedExperience,
    selectedSalary,
    selectedSkills,
  ]);

  const hasActiveFilters = activeFilterChips.length > 0;

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "Location":
        setSelectedLocation(value);
        break;
      case "Industry":
        setSelectedIndustry(value);
        break;
      case "Job Type":
        setSelectedJobType(value);
        break;
      case "Experience Level":
        setSelectedExperience(value);
        break;
      case "Salary Range":
        setSelectedSalary(value);
        break;
      default:
        break;
    }
    setOpenDropdown(null);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleRemoveChip = (type, value) => {
    switch (type) {
      case "location":
        setSelectedLocation("");
        break;
      case "industry":
        setSelectedIndustry("");
        break;
      case "jobType":
        setSelectedJobType("");
        break;
      case "experience":
        setSelectedExperience("");
        break;
      case "salary":
        setSelectedSalary("");
        break;
      case "skill":
        setSelectedSkills((prev) => prev.filter((skill) => skill !== value));
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSelectedLocation("");
    setSelectedIndustry("");
    setSelectedJobType("");
    setSelectedExperience("");
    setSelectedSalary("");
    setSearchText("");
    setSelectedSkills([]);
    dispatch(clearFilters());
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      // Use timeout to avoid conflict with the button click
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

  useEffect(() => {
    // Dispatch all filters to Redux
    dispatch(
      setFilters({
        location: selectedLocation,
        industry: selectedIndustry,
        jobType: selectedJobType,
        experience: selectedExperience,
        salary: selectedSalary,
        skills: selectedSkills,
        searchText: searchText,
      })
    );
  }, [
    selectedLocation,
    selectedIndustry,
    selectedJobType,
    selectedExperience,
    selectedSalary,
    selectedSkills,
    searchText,
    dispatch,
  ]);

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:block w-full py-4">
        <div className="flex items-center gap-3 flex-wrap w-full">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchText}
                onChange={handleSearchChange}
                className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
              />
            </div>

            {/* Skills Dropdown */}
            <div 
              className="relative" 
              ref={openDropdown === 'skills' ? dropdownRef : null}
              onMouseEnter={openDropdown === 'skills' ? handleMouseEnter : undefined}
              onMouseLeave={openDropdown === 'skills' ? handleMouseLeave : undefined}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'skills' ? null : 'skills')}
                className="h-9 px-3 text-sm font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
              >
                Skills
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'skills' ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === 'skills' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-[#444444] dark:bg-[#121212]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {skillsData.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`desktop-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-0 dark:border-[#444444]"
                          />
                          <Label
                            htmlFor={`desktop-${skill}`}
                            className="text-sm font-normal text-gray-700 cursor-pointer dark:text-[#B0B0B0]"
                          >
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Dropdown */}
            <div 
              className="relative" 
              ref={openDropdown === 'location' ? dropdownRef : null}
              onMouseEnter={openDropdown === 'location' ? handleMouseEnter : undefined}
              onMouseLeave={openDropdown === 'location' ? handleMouseLeave : undefined}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                className="h-9 px-3 text-sm font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
              >
                Location
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'location' ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === 'location' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-[#444444] dark:bg-[#121212]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <RadioGroup value={selectedLocation} onValueChange={(value) => handleFilterChange("Location", value)}>
                      <div className="space-y-2">
                        {filterData.map((data) => {
                          if (data.filterType === "Location") {
                            return data.array.map((loc) => (
                              <div key={loc} className="flex items-center space-x-2">
                                <RadioGroupItem value={loc} id={`desktop-location-${loc}`} />
                                <Label htmlFor={`desktop-location-${loc}`} className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]">
                                  {loc}
                                </Label>
                              </div>
                            ));
                          }
                          return null;
                        })}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Industry Dropdown */}
            <div 
              className="relative" 
              ref={openDropdown === 'industry' ? dropdownRef : null}
              onMouseEnter={openDropdown === 'industry' ? handleMouseEnter : undefined}
              onMouseLeave={openDropdown === 'industry' ? handleMouseLeave : undefined}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'industry' ? null : 'industry')}
                className="h-9 px-3 text-sm font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
              >
                Industry
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'industry' ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === 'industry' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-[#444444] dark:bg-[#121212]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <RadioGroup value={selectedIndustry} onValueChange={(value) => handleFilterChange("Industry", value)}>
                      <div className="space-y-2">
                        {filterData.map((data) => {
                          if (data.filterType === "Industry") {
                            return data.array.map((ind) => (
                              <div key={ind} className="flex items-center space-x-2">
                                <RadioGroupItem value={ind} id={`desktop-industry-${ind}`} />
                                <Label htmlFor={`desktop-industry-${ind}`} className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]">
                                  {ind}
                                </Label>
                              </div>
                            ));
                          }
                          return null;
                        })}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Job Type Dropdown */}
            <div 
              className="relative" 
              ref={openDropdown === 'jobtype' ? dropdownRef : null}
              onMouseEnter={openDropdown === 'jobtype' ? handleMouseEnter : undefined}
              onMouseLeave={openDropdown === 'jobtype' ? handleMouseLeave : undefined}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'jobtype' ? null : 'jobtype')}
                className="h-9 px-3 text-sm font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
              >
                Job Type
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'jobtype' ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === 'jobtype' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-[#444444] dark:bg-[#121212]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <RadioGroup value={selectedJobType} onValueChange={(value) => handleFilterChange("Job Type", value)}>
                      <div className="space-y-2">
                        {filterData.map((data) => {
                          if (data.filterType === "Job Type") {
                            return data.array.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={`desktop-jobtype-${type}`} />
                                <Label htmlFor={`desktop-jobtype-${type}`} className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]">
                                  {type}
                                </Label>
                              </div>
                            ));
                          }
                          return null;
                        })}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Experience Dropdown */}
            <div 
              className="relative" 
              ref={openDropdown === 'experience' ? dropdownRef : null}
              onMouseEnter={openDropdown === 'experience' ? handleMouseEnter : undefined}
              onMouseLeave={openDropdown === 'experience' ? handleMouseLeave : undefined}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'experience' ? null : 'experience')}
                className="h-9 px-3 text-sm font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
              >
                Experience
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'experience' ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === 'experience' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-[#444444] dark:bg-[#121212]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <RadioGroup value={selectedExperience} onValueChange={(value) => handleFilterChange("Experience Level", value)}>
                      <div className="space-y-2">
                        {filterData.map((data) => {
                          if (data.filterType === "Experience Level") {
                            return data.array.map((exp) => (
                              <div key={exp} className="flex items-center space-x-2">
                                <RadioGroupItem value={exp} id={`desktop-exp-${exp}`} />
                                <Label htmlFor={`desktop-exp-${exp}`} className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]">
                                  {exp}
                                </Label>
                              </div>
                            ));
                          }
                          return null;
                        })}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Salary Dropdown */}
            <div 
              className="relative" 
              ref={openDropdown === 'salary' ? dropdownRef : null}
              onMouseEnter={openDropdown === 'salary' ? handleMouseEnter : undefined}
              onMouseLeave={openDropdown === 'salary' ? handleMouseLeave : undefined}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'salary' ? null : 'salary')}
                className="h-9 px-3 text-sm font-normal border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
              >
                Salary
                <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform ${openDropdown === 'salary' ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === 'salary' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-[#444444] dark:bg-[#121212]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <RadioGroup value={selectedSalary} onValueChange={(value) => handleFilterChange("Salary Range", value)}>
                      <div className="space-y-2">
                        {filterData.map((data) => {
                          if (data.filterType === "Salary Range") {
                            return data.array.map((salary) => (
                              <div key={salary} className="flex items-center space-x-2">
                                <RadioGroupItem value={salary} id={`desktop-salary-${salary}`} />
                                <Label htmlFor={`desktop-salary-${salary}`} className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]">
                                  {salary}
                                </Label>
                              </div>
                            ));
                          }
                          return null;
                        })}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearFilters}
                className="h-9 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-[#888888] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1a1a1a]"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-[#888888]">
                Active:
              </span>
              {activeFilterChips.map((chip) => (
                <button
                  key={`${chip.type}-${chip.label}`}
                  type="button"
                  onClick={() => handleRemoveChip(chip.type, chip.label)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>{chip.label}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 dark:bg-[#121212] dark:border-[#444444]">
        <div className="px-4 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobileFilters(true)}
            className="w-full justify-between h-10 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="text-xs text-gray-500">({activeFilterChips.length})</span>
              )}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Active Filter Chips on Mobile */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {activeFilterChips.map((chip) => (
                <button
                  key={`mobile-chip-${chip.type}-${chip.label}`}
                  type="button"
                  onClick={() => handleRemoveChip(chip.type, chip.label)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-[#B0B0B0] dark:hover:bg-[#1a1a1a]"
                >
                  <span>{chip.label}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-[#121212] shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 dark:border-[#444444] dark:bg-[#121212]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E0E0E0]">
                Filters
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-[#888888] dark:hover:bg-[#1a1a1a]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-2 block">
                  Search
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="h-10 w-full pl-9 border-gray-300 dark:border-[#444444]"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-3 block">
                  Skills
                </Label>
                <div className="space-y-2">
                  {skillsData.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`mobile-${skill}`}
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-0"
                      />
                      <Label
                        htmlFor={`mobile-${skill}`}
                        className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]"
                      >
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Filter Sections */}
              {filterData.map((data) => (
                <div key={data.filterType}>
                  <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-3 block">
                    {data.filterType}
                  </Label>
                  <RadioGroup
                    value={
                      data.filterType === "Location" ? selectedLocation :
                      data.filterType === "Industry" ? selectedIndustry :
                      data.filterType === "Job Type" ? selectedJobType :
                      data.filterType === "Experience Level" ? selectedExperience :
                      selectedSalary
                    }
                    onValueChange={(value) => handleFilterChange(data.filterType, value)}
                  >
                    <div className="space-y-2">
                      {data.array.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`mobile-${data.filterType}-${option}`} />
                          <Label htmlFor={`mobile-${data.filterType}-${option}`} className="text-sm text-gray-700 cursor-pointer dark:text-[#B0B0B0]">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 dark:border-[#444444] dark:bg-[#121212]">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Clear all
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200"
                >
                  Apply filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterCard;
