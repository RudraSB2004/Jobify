import React, { useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react"; // For icons

const CreatePost = ({ setCreatePost }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const CreatePostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/addpost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setCreatePost(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={setCreatePost}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={CreatePostHandler} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {imagePreview ? (
            <div className="relative w-full h-56 rounded-md overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                onClick={() => setImagePreview("")}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <input
                type="file"
                name="image"
                ref={imageRef}
                onChange={fileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="flex gap-2 items-center"
                onClick={() => imageRef.current.click()}
              >
                <Upload className="w-4 h-4" /> Select Image
              </Button>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreatePost(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
