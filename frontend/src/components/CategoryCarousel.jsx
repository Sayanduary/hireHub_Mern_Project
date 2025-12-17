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
    <section className="py-20 bg-gray-50 dark:bg-[#121212] transition-colors">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
            Explore roles by category
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-[#B0B0B0]">
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
                    border-2 border-gray-200 dark:border-[#444444]
                    bg-white dark:bg-[#121212]
                    text-sm font-semibold
                    text-gray-700 dark:text-[#B0B0B0]
                    hover:bg-gray-900 dark:hover:bg-[#E0E0E0]
                    hover:text-white dark:hover:text-[#121212]
                    hover:border-gray-900 dark:hover:border-[#E0E0E0]
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
          <CarouselPrevious className="hidden md:flex border border-gray-200 dark:border-[#444444] bg-white dark:bg-[#121212] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-[#B0B0B0]" />
          <CarouselNext className="hidden md:flex border border-gray-200 dark:border-[#444444] bg-white dark:bg-[#121212] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-[#B0B0B0]" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
