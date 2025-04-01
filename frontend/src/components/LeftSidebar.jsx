import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaUserEdit, FaBookmark, FaPlusCircle, FaUsers } from "react-icons/fa";
import CreatePost from "./CreatePost";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUser";

const LeftSidebar = () => {
  useGetSuggestedUsers();
  const { user } = useSelector((store) => store.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [createPost, setCreatePost] = useState(false);
  const [showSuggestedUsers, setShowSuggestedUsers] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* New Post Modal */}
      {createPost && <CreatePost setCreatePost={setCreatePost} />}

      {/* Suggested Users Sheet */}
      <Sheet open={showSuggestedUsers} onOpenChange={setShowSuggestedUsers}>
        <SheetContent side="left" className="w-72 bg-white shadow-md">
          <SuggestedUsers onClose={() => setShowSuggestedUsers(false)} />
        </SheetContent>
      </Sheet>

      {/* Mobile Sidebar */}
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="fixed left-4 top-14">
              ☰
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-white shadow-md">
            <SidebarContent
              user={user}
              setCreatePost={setCreatePost}
              setShowSuggestedUsers={setShowSuggestedUsers}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="fixed left-0 top-0 h-[90%] w-72 bg-white shadow-md border-r top-20">
          <SidebarContent
            user={user}
            setCreatePost={setCreatePost}
            setShowSuggestedUsers={setShowSuggestedUsers}
          />
        </aside>
      )}
    </>
  );
};

// Sidebar Content Component
const SidebarContent = ({ user, setCreatePost, setShowSuggestedUsers }) => {
  return (
    <>
      {/* Profile Section */}
      <div className="flex flex-col items-center p-4 border-b">
        <img
          className="w-20 h-20 rounded-full border-4 border-gray-200 shadow-md"
          src={
            user?.profilePicture ||
            "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
          }
          alt="User Avatar"
        />
        <h3 className="text-lg font-semibold mt-2">
          <Link to={"/edit"}>{user?.username || "User Name"}</Link>
        </h3>
        <p className="text-sm text-gray-500">{user?.bio || "Bio..."}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>

        <div className="mt-2 text-sm">
          <p>
            <span className="font-medium">Role:</span> {user?.role || "N/A"}
          </p>
          <p>
            <span className="font-medium">Followers:</span>{" "}
            {user?.followers?.length || 0}
          </p>
          <p>
            <span className="font-medium">Following:</span>{" "}
            {user?.following?.length || 0}
          </p>
        </div>
      </div>

      {/* Sidebar Menu Items */}
      <div className="mt-4 space-y-2 px-4">
        <Link
          to="/edit"
          className="flex items-center gap-2 p-3 text-md font-medium hover:bg-gray-100 rounded-lg transition"
        >
          <FaUserEdit className="w-5 h-5 text-gray-600" />
          Edit Profile
        </Link>

        <div className="flex items-center gap-2 p-3 text-md font-medium hover:bg-gray-100 rounded-lg cursor-pointer transition">
          <FaBookmark className="w-5 h-5 text-gray-600" />
          Bookmark
        </div>

        <div
          onClick={() => setCreatePost(true)}
          className="flex items-center gap-2 p-3 text-md font-medium hover:bg-gray-100 rounded-lg cursor-pointer transition"
        >
          <FaPlusCircle className="w-5 h-5 text-gray-600" />
          New Post
        </div>

        {/* Suggested Users */}
        <div
          onClick={() => setShowSuggestedUsers(true)}
          className="flex items-center gap-2 p-3 text-md font-medium hover:bg-gray-100 rounded-lg cursor-pointer transition"
        >
          <FaUsers className="w-5 h-5 text-gray-600" />
          Suggested Users
        </div>
      </div>
    </>
  );
};

// Suggested Users Component (ShadCN Sheet)
const SuggestedUsers = ({ onClose }) => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Suggested Users</h2>
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div
            key={user?._id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              className="w-10 h-10 rounded-full"
              src={user?.profilePicture || "https://github.com/shadcn.png"}
              alt={user.username}
            />
            <span
              className="text-md font-medium"
              onClick={() => navigate(`/profile/${user?._id}`)}
            >
              {user?.username}
            </span>
          </div>
        ))}
      </div>
      <Button onClick={onClose} className="w-full mt-4">
        Close
      </Button>
    </div>
  );
};

export default LeftSidebar;
