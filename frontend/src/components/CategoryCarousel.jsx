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
import { setSearchedQuery } from "@/redux/jobSlice";

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
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  return (
    <section className="relative py-20">
      {/* background */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Explore roles by category
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Discover opportunities tailored to your expertise
          </p>
        </div>

        {/* Carousel */}
        <Carousel className="mx-auto max-w-5xl">
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
                    w-full h-10
                    rounded-lg
                    border border-gray-200 dark:border-white/10
                    bg-white dark:bg-black
                    text-sm font-medium
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-white/5
                    hover:border-gray-300 dark:hover:border-white/20
                    transition
                  "
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls */}
          <CarouselPrevious className="hidden md:flex border border-gray-200 dark:border-white/10 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5" />
          <CarouselNext className="hidden md:flex border border-gray-200 dark:border-white/10 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
