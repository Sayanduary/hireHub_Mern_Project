import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    file: null,
    profilePhoto: null,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    setInput({
      fullname: user.fullname || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.profile?.bio || "",
      skills: user.profile?.skills?.length
        ? user.profile.skills.join(", ")
        : "",
      linkedinUrl: user.profile?.linkedinUrl || "",
      githubUrl: user.profile?.githubUrl || "",
      file: null,
      profilePhoto: null,
    });
  }, [user]);

  const changeEventHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput((prev) => ({ ...prev, file }));
  };

  const profilePhotoChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput((prev) => ({ ...prev, profilePhoto: file }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    formData.append("linkedinUrl", input.linkedinUrl);
    formData.append("githubUrl", input.githubUrl);
    if (input.file instanceof File) {
      formData.append("file", input.file);
    }
    if (input.profilePhoto instanceof File) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            onClick={() => navigate("/profile")}
            variant="ghost"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-700 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Edit Profile
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Keep your contact information and resume current.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Full name
                </Label>
                <Input
                  name="fullname"
                  type="text"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="h-11 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-600 transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Phone number
                </Label>
                <Input
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Skills (comma separated)
                </Label>
                <Input
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  placeholder="React, Node.js, Python"
                  className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  LinkedIn URL
                </Label>
                <Input
                  name="linkedinUrl"
                  type="url"
                  value={input.linkedinUrl}
                  onChange={changeEventHandler}
                  placeholder="https://linkedin.com/in/username"
                  className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  GitHub URL
                </Label>
                <Input
                  name="githubUrl"
                  type="url"
                  value={input.githubUrl}
                  onChange={changeEventHandler}
                  placeholder="https://github.com/username"
                  className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Bio
              </Label>
              <textarea
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                rows={4}
                placeholder="Brief overview of your experience and expertise"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Profile photo
                </Label>
                <Input
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={profilePhotoChangeHandler}
                  className="h-11 cursor-pointer rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-black focus-visible:ring-0 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-300 dark:file:bg-white dark:file:text-gray-900 dark:hover:file:bg-gray-100 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PNG or JPG up to 5MB
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Resume (PDF)
                </Label>
                <Input
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="h-11 cursor-pointer rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-black focus-visible:ring-0 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-300 dark:file:bg-white dark:file:text-gray-900 dark:hover:file:bg-gray-100 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Upload your latest resume
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-200 pt-8 dark:border-gray-800">
              <Button
                type="button"
                onClick={() => navigate("/profile")}
                variant="outline"
                className="h-11 rounded-lg border-2 border-gray-200 bg-white px-6 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-700 transition-all duration-200"
              >
                Cancel
              </Button>
              {loading ? (
                <Button
                  disabled
                  className="h-11 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-black shadow-sm dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all duration-200"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="h-11 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-black hover:scale-[1.02] shadow-sm dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all duration-200"
                >
                  Save changes
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ProfileEdit;
