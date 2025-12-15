import React, { useEffect, useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobSlice";
import { Search, ChevronDown } from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    location: true,
    industry: false,
    jobtype: false,
    experiencelevel: false,
    salaryrange: false,
  });
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

  const changeHandler = (filterType, value) => {
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
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
    setExpandedSections({
      skills: true,
      location: true,
      industry: false,
      jobtype: false,
      experiencelevel: false,
      salaryrange: false,
    });
  };

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
    <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-3xl border border-neutral-200/70 bg-[#F9F9F5] p-6 text-neutral-900 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] transition-colors dark:border-white/10 dark:bg-neutral-950/95 dark:text-neutral-100 lg:sticky lg:top-28">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-48 bg-[radial-gradient(circle_at_top,_rgba(44,44,42,0.08),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Refine search
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Tailor openings with granular filters.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="relative mt-6 space-y-7">
        <section className="rounded-2xl border border-neutral-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <Label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Search by company or role
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <Input
              type="text"
              placeholder="Search teams, roles, or companies"
              value={searchText}
              onChange={handleSearchChange}
              className="h-11 w-full rounded-xl border border-neutral-200/80 bg-white/60 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 dark:border-white/10 dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-neutral-300/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Active filters
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {activeFilterChips.length} selected
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {hasActiveFilters ? (
              activeFilterChips.map((chip) => (
                <button
                  key={`${chip.type}-${chip.label}`}
                  type="button"
                  onClick={() => handleRemoveChip(chip.type, chip.label)}
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-300/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-neutral-50"
                  aria-label={`Remove ${chip.label}`}
                >
                  <span>{chip.label}</span>
                  <span className="text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-200">
                    ×
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No filters applied yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <button
            type="button"
            onClick={() => toggleSection("skills")}
            className="flex w-full items-center justify-between text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50"
            aria-expanded={expandedSections.skills}
            aria-controls="skills-panel"
          >
            <span>Skills</span>
            <ChevronDown
              size={16}
              className={`h-4 w-4 transition-transform duration-200 ${
                expandedSections.skills ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.skills && (
            <div id="skills-panel" className="mt-4 space-y-2">
              {skillsData.slice(0, 8).map((skill) => {
                const checked = selectedSkills.includes(skill);
                return (
                  <label
                    key={skill}
                    htmlFor={`skill-${skill}`}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      checked
                        ? "border-neutral-900 bg-white text-neutral-900 shadow-sm dark:border-white dark:bg-white/10 dark:text-neutral-50"
                        : "border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white/60 dark:text-neutral-300 dark:hover:border-white/10 dark:hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`skill-${skill}`}
                      checked={checked}
                      onChange={() => handleSkillToggle(skill)}
                      className="h-4 w-4 accent-neutral-900 transition-[accent-color] dark:accent-neutral-50"
                    />
                    <span>{skill}</span>
                  </label>
                );
              })}
              <details className="group text-sm text-neutral-500 transition-colors dark:text-neutral-400">
                <summary className="flex cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200">
                  More skills
                </summary>
                <div className="mt-3 space-y-2">
                  {skillsData.slice(8).map((skill) => {
                    const checked = selectedSkills.includes(skill);
                    return (
                      <label
                        key={skill}
                        htmlFor={`skill-${skill}`}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                          checked
                            ? "border-neutral-900 bg-white text-neutral-900 shadow-sm dark:border-white dark:bg-white/10 dark:text-neutral-50"
                            : "border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white/60 dark:text-neutral-300 dark:hover:border-white/10 dark:hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`skill-${skill}`}
                          checked={checked}
                          onChange={() => handleSkillToggle(skill)}
                          className="h-4 w-4 accent-neutral-900 transition-[accent-color] dark:accent-neutral-50"
                        />
                        <span>{skill}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
            </div>
          )}
        </section>

        {filterData.map((data, index) => {
          const sectionKey = data.filterType.toLowerCase().replace(" ", "");

          let currentValue = "";
          switch (data.filterType) {
            case "Location":
              currentValue = selectedLocation;
              break;
            case "Industry":
              currentValue = selectedIndustry;
              break;
            case "Job Type":
              currentValue = selectedJobType;
              break;
            case "Experience Level":
              currentValue = selectedExperience;
              break;
            case "Salary Range":
              currentValue = selectedSalary;
              break;
            default:
              currentValue = "";
          }

          return (
            <section
              key={data.filterType}
              className="rounded-2xl border border-neutral-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <button
                type="button"
                onClick={() => toggleSection(sectionKey)}
                className="flex w-full items-center justify-between text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50"
                aria-expanded={expandedSections[sectionKey]}
              >
                <span>{data.filterType}</span>
                <ChevronDown
                  size={16}
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expandedSections[sectionKey] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections[sectionKey] && (
                <RadioGroup
                  value={currentValue}
                  onValueChange={(value) =>
                    changeHandler(data.filterType, value)
                  }
                  className="mt-4 space-y-2"
                >
                  {data.array.map((item, idx) => {
                    const itemId = `id${index}-${idx}`;
                    const active = currentValue === item;
                    return (
                      <div
                        key={itemId}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                          active
                            ? "border-neutral-900 bg-white text-neutral-900 shadow-sm dark:border-white dark:bg-white/10 dark:text-neutral-50"
                            : "border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white/60 dark:text-neutral-300 dark:hover:border-white/10 dark:hover:bg-white/5"
                        }`}
                      >
                        <RadioGroupItem
                          value={item}
                          id={itemId}
                          className="text-neutral-900 transition-colors data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900 dark:text-neutral-100 dark:data-[state=checked]:border-neutral-50 dark:data-[state=checked]:bg-neutral-50"
                        />
                        <Label
                          htmlFor={itemId}
                          className="cursor-pointer text-sm font-normal text-neutral-600 dark:text-neutral-300"
                        >
                          {item}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default FilterCard;
