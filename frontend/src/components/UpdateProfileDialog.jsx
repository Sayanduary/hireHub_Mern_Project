import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

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
    if (!open || !user) return;
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
  }, [open, user]);

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
        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed", {
        duration: 1000,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px] rounded-md border border-gray-200 bg-white px-0 pb-0 pt-0 dark:border-[#444444] dark:bg-[#0d0d0d]">
        <DialogHeader className="space-y-2 px-8 pb-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">
            Update Profile
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-[#888888]">
            Keep your contact information and resume current.
          </p>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-8 px-8 pb-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                Full name
              </Label>
              <Input
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                Email
              </Label>
              <Input
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                Phone number
              </Label>
              <Input
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                Skills (comma separated)
              </Label>
              <Input
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="React, Node.js, Python"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                LinkedIn URL
              </Label>
              <Input
                name="linkedinUrl"
                type="url"
                value={input.linkedinUrl}
                onChange={changeEventHandler}
                placeholder="https://linkedin.com/in/username"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                GitHub URL
              </Label>
              <Input
                name="githubUrl"
                type="url"
                value={input.githubUrl}
                onChange={changeEventHandler}
                placeholder="https://github.com/username"
                className="h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
              Bio
            </Label>
            <textarea
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              rows={4}
              placeholder="Brief overview of your experience and expertise"
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus-visible:outline-none focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#E0E0E0] dark:placeholder:text-gray-500 dark:focus:border-gray-900"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                Profile photo
              </Label>
              <Input
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={profilePhotoChangeHandler}
                className="h-10 cursor-pointer rounded-md border border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#B0B0B0] dark:file:bg-gray-100 dark:file:text-gray-900"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PNG or JPG up to 5MB
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
                Resume (PDF)
              </Label>
              <Input
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="h-10 cursor-pointer rounded-md border border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800 focus-visible:ring-0 dark:border-[#444444] dark:bg-[#0d0d0d] dark:text-[#B0B0B0] dark:file:bg-gray-100 dark:file:text-gray-900"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Upload your latest resume
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            {loading ? (
              <Button className="h-10 w-full rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-10 w-full rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200"
              >
                Save changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
