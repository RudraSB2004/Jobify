import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaBriefcase, FaSearch, FaPlusCircle, FaListAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import useGetAllApplication from "../hooks/useGetAllApplication";

const RecruiterJobLeftSide = () => {
  useGetAllApplication();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
          <SheetContent side="left" className="w-80 bg-white p-5 rounded-lg">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="fixed left-0 top-20 h-[90%] w-80 bg-white rounded-lg p-5">
          <SidebarContent />
        </aside>
      )}
    </>
  );
};

const SidebarContent = () => {
  return (
    <Card className="p-5 space-y-6  rounded-lg bg-white">
      <h3 className="text-xl font-semibold text-gray-700 flex items-center">
        <FaSearch className="mr-3 text-indigo-600" />
        Dashboard
      </h3>
      <div className="space-y-4">
        <Link
          to="/jobs/myjobs"
          className="flex items-center text-md text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <FaBriefcase className="mr-3 text-indigo-600" />
          See your Jobs
        </Link>
        <Link
          to="/jobs/create"
          className="flex items-center text-md text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <FaPlusCircle className="mr-3 text-green-500" />
          Create Job Post
        </Link>
        <Link
          to="/jobs/allapplication"
          className="flex items-center text-md text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <FaListAlt className="mr-3 text-yellow-500" />
          See All Applications
        </Link>
      </div>
    </Card>
  );
};

export default RecruiterJobLeftSide;
