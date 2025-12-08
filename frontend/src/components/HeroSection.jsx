import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center py-12 bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-5 my-10 px-4">
        <span className="mx-auto px-4 py-2 rounded-full bg-[#e8f3ff] dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#70b5f9] font-medium">
          No. 1 Job Hunt Website
        </span>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-[#0a66c2] dark:text-[#70b5f9]">Dream Jobs</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join millions of professionals finding their perfect career
          opportunity
        </p>
        <div className="flex w-full max-w-2xl shadow-lg border border-gray-200 dark:border-gray-700 rounded-full items-center gap-4 mx-auto bg-white dark:bg-gray-800 overflow-hidden">
          <input
            type="text"
            placeholder="Search jobs by title, skill, or company"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full px-6 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-full bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#70b5f9] dark:hover:bg-[#5a9ad8] mr-1 px-8"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
