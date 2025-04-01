const OpenImageInNewTab = ({ imageUrl }) => {
  const openImage = () => {
    if (imageUrl && typeof imageUrl === "string" && imageUrl != "undefined") {
      window.open(imageUrl, "_blank");
    } else {
      alert("Image URL not found or InValid");
    }
  };
  return (
    <div>
      <button
        onClick={openImage}
        className="bg-blue-600 text-white hover:bg-blue-700 w-50 rounded-lg py-3 px-8 my-auto w-full mr-7"
      >
        Open resume
      </button>
    </div>
  );
};

export default OpenImageInNewTab;
