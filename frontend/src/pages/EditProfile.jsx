import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice";
import ContactInfo from "../components/ContactInfo";
import UploadResume from "../components/UploadResume";
import UserPost from "../components/UserPost";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
const EditProfile = () => {
  const [open, setOpen] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [resume, setResume] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.posts || !user) {
      navigate("/login");
    }
  }, [user, user.post]);

  useEffect(() => {}, [user.posts]);

  return (
    <div className="w-screen min-h-screen pt-[80px] md:pl-[70px] lg:pl-[250px] grid grid-cols-2 sm:w-1/2">
      {resume && <UploadResume setResume={setResume} />}
      {openContact && <ContactInfo setOpenContact={setOpenContact} />}

      {/* Main Profile Card */}
      <div className="w-[800px] h-full flex flex-col items-center bg-white rounded-md ml-24 shadow-lg">
        <div className="relative w-full h-32 bg-gbg-neutral-700 rounded-t-lg">
          <img
            className="w-32 h-32 shadow-xl border-4 border-white ml-80 rounded-full mt-16 object-cover"
            alt="user-picture"
            src={user?.profilePicture || "https://via.placeholder.com/150"}
          />
        </div>

        <div className="mt-16 w-full text-center pt-10">
          <p className="text-2xl font-bold text-gray-800">{user?.username}</p>
          <span className="text-sm text-gray-500">
            {user?.bio || "No bio available"}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-center mt-4 space-x-8 text-gray-600">
          <div className="text-center">
            <p className="text-xl font-semibold">
              {user.followers.length || "0"}
            </p>
            <span className="text-sm">Followers</span>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">
              {user.following.length || "0"}
            </p>
            <span className="text-sm">Following</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around gap-4 mt-8 mb-8">
          <Button variant="outline" onClick={() => setOpenContact(true)}>
            Contact Info
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>
            <Edit setOpen={setOpen} />
          </Dialog>
          <Button onClick={() => setResume(true)}>Edit Resume</Button>
        </div>

        {/* User Posts */}
        <div className="h-full w-full">
          {user.posts.length > 0 ? (
            user.posts.map((userpost) => (
              <UserPost key={userpost.id} post={userpost} userDelete={true} />
            ))
          ) : (
            <div className="h-full w-full flex justify-center items-center">
              <p className="text-slate-400">No Posts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

const Edit = ({ setOpen }) => {
  const dispatch = useDispatch();
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [userData, setUserdata] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    role: user?.role || "",
  });
  const [file, setFile] = useState(null);

  const changeHandler = (e) => {
    setUserdata({ ...userData, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("phone", userData.phone);
    formData.append("bio", userData.bio);
    formData.append("role", userData.role);
    formData.append("profilePicture", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={submitHandler}>
        <div className="flex items-center space-x-4">
          <img
            className="w-16 h-16 rounded-full"
            src={user?.profilePicture || "https://via.placeholder.com/150"}
          />
          <Input
            type="file"
            onChange={fileChangeHandler}
            className="hidden"
            ref={imageRef}
          />
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              imageRef.current.click();
            }}
          >
            Change Picture
          </Button>
        </div>

        <div>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            value={userData.username}
            onChange={changeHandler}
          />
        </div>

        <div>
          <Label>Bio</Label>
          <Textarea name="bio" value={userData.bio} onChange={changeHandler} />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={changeHandler}
          />
        </div>

        <div>
          <Label>Role</Label>
          <Select
            name="role"
            value={userData.role}
            onValueChange={(value) => setUserdata({ ...userData, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Recruiter">Recruiter</SelectItem>
              <SelectItem value="Job Seeker">Job Seeker</SelectItem>
              <SelectItem value="Employer">Employer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </DialogContent>
  );
};
