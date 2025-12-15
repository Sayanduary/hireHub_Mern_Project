import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const url = `${JOB_API_END_POINT}/get`;
        console.log("Fetching jobs from:", url);

        const res = await axios.get(url, { withCredentials: true });

        if (res.data.success) {
          console.log("Jobs fetched successfully:", res.data.jobs.length);
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.response?.status === 401) {
          // User not authenticated, set empty jobs array
          dispatch(setAllJobs([]));
        }
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
