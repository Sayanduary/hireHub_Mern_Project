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
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl border border-neutral-200/70 bg-[#F9F9F5]/95 px-0 pb-0 pt-0 shadow-[0_24px_60px_-20px_rgba(15,15,15,0.28)] transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/95">
        <DialogHeader className="space-y-2 px-8 pb-6 pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            Profile
          </p>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Update workspace details
          </DialogTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Keep your contact, narrative, and resume current so recruiters can
            respond without friction.
          </p>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-8 px-8 pb-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Full name
              </Label>
              <Input
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                className="h-11 rounded-xl border border-neutral-200/70 bg-white/70 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/10 dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Email
              </Label>
              <Input
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="h-11 rounded-xl border border-neutral-200/70 bg-white/70 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/10 dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Phone number
              </Label>
              <Input
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="h-11 rounded-xl border border-neutral-200/70 bg-white/70 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/10 dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Skills (comma separated)
              </Label>
              <Input
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="Product design, Figma, Systems"
                className="h-11 rounded-xl border border-neutral-200/70 bg-white/70 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/10 dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Bio
            </Label>
            <textarea
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              rows={4}
              placeholder="Craft a succinct overview of your experience and focus."
              className="w-full rounded-xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/10 dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-white/20"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Profile photo
              </Label>
              <Input
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={profilePhotoChangeHandler}
                className="h-11 cursor-pointer rounded-xl border border-dashed border-neutral-200/70 bg-white/60 text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:font-medium file:text-neutral-100 focus:border-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/15 dark:bg-transparent dark:text-neutral-300 dark:file:bg-white dark:file:text-neutral-950 dark:focus:border-white/20"
              />
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                PNG or JPG up to 5MB.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Resume (PDF)
              </Label>
              <Input
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="h-11 cursor-pointer rounded-xl border border-dashed border-neutral-200/70 bg-white/60 text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:font-medium file:text-neutral-100 focus:border-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-200 dark:border-white/15 dark:bg-transparent dark:text-neutral-300 dark:file:bg-white dark:file:text-neutral-950 dark:focus:border-white/20"
              />
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Upload the latest version so teams have accurate context.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            {loading ? (
              <Button className="h-11 w-full rounded-xl border border-neutral-900 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 dark:border-transparent dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-11 w-full rounded-xl border border-neutral-900 bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-800 dark:border-transparent dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
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
