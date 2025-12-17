import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters, setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "Full-Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "UI / UX Designer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setFilters({ searchText: query }));
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Explore roles by category
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Discover opportunities tailored to your expertise
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ loop: true }} 
          className="mx-auto max-w-5xl"
        >
          <CarouselContent className="-ml-3">

            {categories.map((cat) => (
              <CarouselItem
                key={cat}
                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Button
                  onClick={() => searchJobHandler(cat)}
                  variant="outline"
                  className="
                    w-full h-11
                    rounded-full
                    border-2 border-gray-200 dark:border-gray-800
                    bg-white dark:bg-[#0a0a0a]
                    text-sm font-semibold
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-900 dark:hover:bg-white
                    hover:text-white dark:hover:text-gray-900
                    hover:border-gray-900 dark:hover:border-white
                    hover:scale-105
                    transition-all duration-200 ease-out
                  "
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls */}
          <CarouselPrevious className="hidden md:flex border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" />
          <CarouselNext className="hidden md:flex border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
