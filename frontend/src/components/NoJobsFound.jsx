import { FaSearch } from "react-icons/fa"; // Import an icon (optional)

const NoJobsFound = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[80%] border rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="text-center">
        <FaSearch className="mx-auto text-gray-400 text-6xl mb-4" />{" "}
        {/* Optional icon */}
        <h1 className="text-3xl font-bold text-gray-600 mb-4">No Jobs Found</h1>
        <p className="text-gray-500 mb-6">
          We couldn't find any jobs matching your criteria.
        </p>
        <a href="" className="text-blue-500 hover:underline">
          Back to Job Listings
        </a>
      </div>
    </div>
  );
};

export default NoJobsFound;
