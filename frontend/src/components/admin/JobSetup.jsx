import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, X } from "lucide-react";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const JobSetup = () => {
  const params = useParams();
  useGetAllCompanies();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: [],
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [requirementInput, setRequirementInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);
  const { singleJob } = useSelector((store) => store.job);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setInput({
        ...input,
        requirements: [...input.requirements, requirementInput.trim()],
      });
      setRequirementInput("");
    }
  };

  const removeRequirement = (index) => {
    setInput({
      ...input,
      requirements: input.requirements.filter((_, i) => i !== index),
    });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${params.id}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, { duration: 1500 });
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: Array.isArray(job.requirements)
              ? job.requirements
              : [],
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel || "",
            position: job.position || 0,
            companyId: job.company?._id || "",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch job details", { duration: 2000 });
      }
    };
    fetchSingleJob();
  }, [params.id]);

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <div className="my-10">
          <Button
            onClick={() => navigate("/admin/jobs")}
            variant="outline"
            className="flex items-center gap-2 text-gray-500 font-semibold"
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>
          <h1 className="font-bold text-xl mt-5">Edit Job</h1>
          <p className="text-gray-500">Update your job details</p>
        </div>
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a requirement (e.g., 3+ years experience)"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                  className="my-1 flex-1"
                />
                <Button
                  type="button"
                  onClick={addRequirement}
                  className="h-10 px-4 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200"
                >
                  Add
                </Button>
              </div>
              {input.requirements.length > 0 && (
                <div className="mt-4 space-y-2">
                  {input.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-md"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-[#666666]" />
                        <span className="text-sm text-gray-700 dark:text-[#E0E0E0]">
                          {req}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Salary (LPA)</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>Experience Level (in years)</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="my-1"
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select
                  onValueChange={selectChangeHandler}
                  value={companies
                    .find((c) => c._id === input.companyId)
                    ?.name?.toLowerCase()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company?.name?.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobSetup;
