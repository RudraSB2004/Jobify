import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { setSelectedUser } from "../redux/authSlice";
import OpenImageInNewTab from "../lib/OpenImageInNewTab";
import UserPost from "../components/UserPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const { selectedUser, user } = useSelector((store) => store.auth);
  const [openContact, setOpenContact] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetUserProfile(userId);

  const [following, setFollowing] = useState(false);

  // Initial check when `selectedUser` is set
  useEffect(() => {
    if (selectedUser && user) {
      setFollowing(selectedUser.followers.includes(user._id));
      console.log(selectedUser);
    }
  }, [selectedUser, user]);

  // Effect to navigate if the user is viewing their own profile
  useEffect(() => {
    if (userId === user._id) {
      navigate("/edit");
    }
  }, [userId, user, navigate]);

  const followHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/followorUnfollow/${
          selectedUser._id
        }`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // Toggle the local `following` state immediately
        setFollowing(!following);

        // Update the Redux store `selectedUser` immediately
        const updatedFollowers = following
          ? selectedUser.followers.filter((id) => id !== user._id)
          : [...selectedUser.followers, user._id];

        dispatch(
          setSelectedUser({
            ...selectedUser,
            followers: updatedFollowers,
          })
        );
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error);
    }
  };

  if (!selectedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full pt-20 flex flex-col items-center">
      <Card className="w-[800px] shadow-lg">
        <CardHeader>
          <div className="relative w-full h-32 bg-neutral-700 rounded-t-lg">
            <Avatar className="w-32 h-32 border-4 border-white absolute left-1/2 transform -translate-x-1/2 top-20">
              <AvatarImage
                src={
                  selectedUser?.profilePicture ||
                  "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="text-center pt-20">
          <CardTitle>{selectedUser?.username}</CardTitle>
          <p className="text-sm text-gray-500">
            {selectedUser?.bio || "No bio available"}
          </p>
          <div className="flex justify-center mt-4 space-x-8 text-gray-600">
            <div className="text-center">
              <p className="text-xl font-semibold">
                {selectedUser.followers.length || "0"}
              </p>
              <span className="text-sm">Followers</span>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">
                {selectedUser.following.length || "0"}
              </p>
              <span className="text-sm">Following</span>
            </div>
          </div>
          <div className="flex justify-around gap-4 mt-6">
            <Button variant="outline" onClick={followHandler}>
              {following ? "Following" : "Follow"}
            </Button>
            <Button onClick={() => setOpenContact(true)}>Contact Info</Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-[800px] mt-6">
        {selectedUser.posts.length > 0 ? (
          selectedUser.posts.map((post) => (
            <UserPost key={post._id} post={post} userDelete={false} />
          ))
        ) : (
          <div className="h-full w-full flex justify-center items-center text-gray-400">
            No Posts
          </div>
        )}
      </div>

      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Info</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <p>
              <strong>User Name:</strong> {selectedUser?.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser?.phone || "N/A"}
            </p>
            <p>
              <strong>Bio:</strong> {selectedUser?.bio}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser?.role}
            </p>
            <OpenImageInNewTab imageUrl={selectedUser?.resume}>
              Show Resume
            </OpenImageInNewTab>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
