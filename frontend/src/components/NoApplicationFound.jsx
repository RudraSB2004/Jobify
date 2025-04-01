import { FaSearch } from "react-icons/fa"; // Import an icon (optional)

const NoApplicationFound = () => {
  return (
    <div className="flex flex-col justify-center  items-center w-full   rounded-xl bg-white">
      <div className="text-center">
        <FaSearch className="mx-auto text-gray-400 text-6xl mb-4" />{" "}
        {/* Optional icon */}
        <h1 className="text-3xl font-bold text-gray-600 mb-4">
          No Application Found
        </h1>
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

export default NoApplicationFound;
