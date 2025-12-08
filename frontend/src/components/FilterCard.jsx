import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Search } from "lucide-react";

const fitlerData = [
  {
    fitlerType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    fitlerType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    fitlerType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setSelectedValue(""); // Clear radio selection when searching
  };

  useEffect(() => {
    // Prioritize search text over radio selection
    const query = searchText || selectedValue;
    dispatch(setSearchedQuery(query));
  }, [selectedValue, searchText, dispatch]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-800 shadow-md">
      <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
        Filter Jobs
      </h1>
      <hr className="mt-3 border-gray-200 dark:border-gray-700" />

      {/* Search Box */}
      <div className="my-4">
        <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
          Search by Company or Role
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="e.g., Google, Developer..."
            value={searchText}
            onChange={handleSearchChange}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-[#0a66c2] dark:focus:ring-[#70b5f9]"
          />
        </div>
      </div>

      <hr className="my-3 border-gray-200 dark:border-gray-700" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {fitlerData.map((data, index) => (
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {data.fitlerType}
            </h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div className="flex items-center space-x-2 my-2">
                  <RadioGroupItem
                    value={item}
                    id={itemId}
                    className="dark:border-gray-600"
                  />
                  <Label
                    htmlFor={itemId}
                    className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    {item}
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
