import { setPost } from "../redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllPost = () => {
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/post/all`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setPost(response.data.posts));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [dispatch]); // Added `dispatch` to dependencies

  return posts; // Return `posts` so the component using the hook gets the data
};

export default useGetAllPost;
