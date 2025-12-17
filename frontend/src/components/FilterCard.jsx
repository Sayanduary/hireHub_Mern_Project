import { useEffect, useMemo, useState, useRef } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobSlice";
import { Search, ChevronDown, X, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

/* ======================= DATA ======================= */

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
    array: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"],
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

/* ======================= HELPERS ======================= */

// Convert "3-6 LPA" → { min: 3, max: 6 }
// Convert "15+ LPA" → { min: 15, max: Infinity }
const parseSalaryLPA = (range) => {
  if (!range) return null;

  if (range.includes("+")) {
    const min = Number(range.replace("+ LPA", ""));
    return { min, max: Infinity };
  }

  const [min, max] = range.replace(" LPA", "").split("-").map(Number);
  return { min, max };
};

/* ======================= COMPONENT ======================= */

const FilterCard = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  /* ======================= MEMO ======================= */

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (searchText) chips.push({ type: "search", label: searchText });
    if (selectedLocation)
      chips.push({ type: "location", label: selectedLocation });
    if (selectedIndustry)
      chips.push({ type: "industry", label: selectedIndustry });
    if (selectedJobType)
      chips.push({ type: "jobType", label: selectedJobType });
    if (selectedExperience)
      chips.push({ type: "experience", label: selectedExperience });
    if (selectedSalary) chips.push({ type: "salary", label: selectedSalary });
    selectedSkills.forEach((s) => chips.push({ type: "skill", label: s }));
    return chips;
  }, [
    searchText,
    selectedLocation,
    selectedIndustry,
    selectedJobType,
    selectedExperience,
    selectedSalary,
    selectedSkills,
  ]);

  const hasActiveFilters = activeFilterChips.length > 0;

  /* ======================= HANDLERS ======================= */

  const handleFilterChange = (type, value) => {
    const map = {
      Location: setSelectedLocation,
      Industry: setSelectedIndustry,
      "Job Type": setSelectedJobType,
      "Experience Level": setSelectedExperience,
      "Salary Range": setSelectedSalary,
    };
    map[type]?.(value);
    setOpenDropdown(null);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRemoveChip = (type, value) => {
    const map = {
      search: () => setSearchText(""),
      location: () => setSelectedLocation(""),
      industry: () => setSelectedIndustry(""),
      jobType: () => setSelectedJobType(""),
      experience: () => setSelectedExperience(""),
      salary: () => setSelectedSalary(""),
      skill: () => setSelectedSkills((s) => s.filter((x) => x !== value)),
    };
    map[type]?.();
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedLocation("");
    setSelectedIndustry("");
    setSelectedJobType("");
    setSelectedExperience("");
    setSelectedSalary("");
    setSelectedSkills([]);
    dispatch(clearFilters());
  };

  /* ======================= EFFECTS ======================= */

  useEffect(() => {
    dispatch(
      setFilters({
        searchText,
        location: selectedLocation,
        industry: selectedIndustry,
        jobType: selectedJobType,
        experience: selectedExperience,
        salaryRange: parseSalaryLPA(selectedSalary),
        skills: selectedSkills,
      })
    );
  }, [
    searchText,
    selectedLocation,
    selectedIndustry,
    selectedJobType,
    selectedExperience,
    selectedSalary,
    selectedSkills,
    dispatch,
  ]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ======================= UI CLASSES ======================= */

  const filterBtn =
    "h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100 transition dark:border-[#2a2a2a] dark:bg-[#121212] dark:text-[#d0d0d0] dark:hover:bg-[#1e1e1e]";

  const dropdownBox =
    "absolute top-full left-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 dark:border-[#2a2a2a] dark:bg-[#121212]";

  /* ======================= RENDER ======================= */

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block sticky top-16 z-40 backdrop-blur bg-white/80 dark:bg-[#121212]/80 border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="px-4 py-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search jobs..."
              className="h-10 pl-10 rounded-lg"
            />
          </div>

          {/* Skills */}
          <div
            className="relative"
            ref={openDropdown === "skills" ? dropdownRef : null}
          >
            <button
              className={filterBtn}
              onClick={() =>
                setOpenDropdown(openDropdown === "skills" ? null : "skills")
              }
            >
              Skills <ChevronDown className="ml-2 h-4 w-4 inline" />
            </button>

            {openDropdown === "skills" && (
              <div className={dropdownBox}>
                <div className="p-4 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {skillsData.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(s)}
                        onChange={() => handleSkillToggle(s)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Filters */}
          {filterData.map((f) => (
            <div
              key={f.filterType}
              className="relative"
              ref={openDropdown === f.filterType ? dropdownRef : null}
            >
              <button
                className={filterBtn}
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === f.filterType ? null : f.filterType
                  )
                }
              >
                {f.filterType}
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </button>

              {openDropdown === f.filterType && (
                <div className={dropdownBox}>
                  <div className="p-4">
                    <RadioGroup
                      value={
                        f.filterType === "Location"
                          ? selectedLocation
                          : f.filterType === "Industry"
                          ? selectedIndustry
                          : f.filterType === "Job Type"
                          ? selectedJobType
                          : f.filterType === "Experience Level"
                          ? selectedExperience
                          : selectedSalary
                      }
                      onValueChange={(v) => handleFilterChange(f.filterType, v)}
                    >
                      {f.array.map((o) => (
                        <div key={o} className="flex items-center gap-2">
                          <RadioGroupItem value={o} />
                          <Label>{o}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Chips */}
        {hasActiveFilters && (
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {activeFilterChips.map((c) => (
              <button
                key={c.type + c.label}
                onClick={() => handleRemoveChip(c.type, c.label)}
                className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1.5 text-xs dark:bg-[#1a1a1a]"
              >
                {c.label}
                <X className="h-3 w-3" />
              </button>
            ))}

            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden p-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setShowMobileFilters(true)}
        >
          <Filter className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>
    </>
  );
};

export default FilterCard;
