import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FaBriefcase,
  FaSearch,
  FaMapMarkerAlt,
  FaPlusCircle,
  FaListAlt,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { setAllJobs } from "../redux/jobSlice";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "./ui/card";
const JobLeftSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  // Handle window resize to check for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = async () => {
    let apiUrl = `${import.meta.env.VITE_BACKEND_URL}/job/all`;
    let queryParams = [];

    if (searchQuery?.trim())
      queryParams.push(`searchKeyword=${encodeURIComponent(searchQuery)}`);
    if (jobType?.trim())
      queryParams.push(`niche=${encodeURIComponent(jobType)}`);
    if (location?.trim())
      queryParams.push(`city=${encodeURIComponent(location)}`);

    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join("&")}`;
    }

    try {
      const res = await axios.get(apiUrl);
      dispatch(setAllJobs(res.data.jobs));
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch jobs.");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="fixed left-4 top-14 shadow-md">
              ☰
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 bg-white p-5 shadow-md rounded-lg"
          >
            <SidebarContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              location={location}
              setLocation={setLocation}
              jobType={jobType}
              setJobType={setJobType}
              handleSearch={handleSearch}
              navigate={navigate}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="fixed left-0 top-20 h-[90%] w-80 bg-white shadow-md border-r rounded-lg p-5">
          <SidebarContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            location={location}
            setLocation={setLocation}
            jobType={jobType}
            setJobType={setJobType}
            handleSearch={handleSearch}
            navigate={navigate}
          />
        </aside>
      )}
    </>
  );
};

// Sidebar Content Component
const SidebarContent = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  jobType,
  setJobType,
  handleSearch,
  navigate,
}) => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Find Your Dream Job
      </h3>

      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Location input */}
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Job Type Selector */}
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-Time">Full-Time</SelectItem>
            <SelectItem value="Part-Time">Part-Time</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full">
          Search Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobLeftSidebar;
