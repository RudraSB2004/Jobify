import { setSuggestedUsers } from "../redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/suggested`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setSuggestedUsers(response.data.suggestedUsers));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
