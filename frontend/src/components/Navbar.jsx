import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import axios from "axios";
import { useState } from "react";
import { Briefcase, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const LogoutHandler = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      toast.error("Logout failed", error);
      console.log(error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]); // Clear results for short queries
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/search?query=${query}`
      );
      setSearchResults(data.users);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full p-4 flex items-center justify-between z-20 fixed">
      <div className="flex items-center gap-2">
        <Briefcase className="text-blue-600" size={28} />
        <h2 className="text-blue-600 text-xl font-bold">Jobify</h2>
      </div>

      {/* Search Input with Dropdown */}
      <div className="relative flex items-center w-1/3">
        <Search className="absolute left-3 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search users..."
          className="pl-10 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white shadow-lg border rounded-md z-50">
            {searchResults.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.profilePicture || ""} alt="Avatar" />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-gray-700">{user.username}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="w-[300px]">
        <ul className="flex flex-row items-center justify-evenly text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/">Posts</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/jobs">Jobs</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/chats">Chats</Link>
          </li>
        </ul>
      </div>

      {/* Fixed Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={user?.profilePicture || "https://github.com/shadcn.png"}
                alt="Profile"
              />
              <AvatarFallback>
                {user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-45 z-50">
          {user ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user.role === "Recruiter" ? (
                  <DropdownMenuItem asChild>
                    <Link to="/jobs/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/jobs/myapplications">My Applications</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/edit">Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={LogoutHandler}
                  className="cursor-pointer text-red-600 hover:bg-red-100"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/login">Login</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
