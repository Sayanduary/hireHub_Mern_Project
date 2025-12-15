import { setAllAppliedJobs } from "@/redux/applicationSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = (shouldFetch = true) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shouldFetch) return;
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log("Applied jobs response:", res.data);
        if (res.data.success) {
          console.log("Dispatching applications:", res.data.applications);
          dispatch(setAllAppliedJobs(res.data.applications));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };
    fetchAppliedJobs();
  }, [dispatch, shouldFetch]);
};
export default useGetAppliedJobs;
