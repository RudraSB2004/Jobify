import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { readFileAsDataURL } from "../lib/utils";

const UploadResume = ({ setResume }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const uploadResumeHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setResume(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[400px] bg-white shadow-lg rounded-lg relative">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col space-y-4"
            onSubmit={uploadResumeHandler}
          >
            {imagePreview ? (
              <div className="w-full h-64 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  ref={imageRef}
                  onChange={fileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => imageRef.current.click()}
                >
                  Select File
                </Button>
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </form>
          <Button
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={() => setResume(false)}
          >
            X
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadResume;
