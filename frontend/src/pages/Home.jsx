import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import useGetAllPost from "../hooks/useGetAllPost";
import Posts from "./Posts";
const Home = () => {
  useGetAllPost();
  return (
    <div className="h-full w-screen  pt-24 grid grid-cols-">
      <div>
        <LeftSidebar />
      </div>
      <div className=" h-full lg:pl-[400px] md:w-[85%]">
        <Posts />
      </div>
    </div>
  );
};

export default Home;
