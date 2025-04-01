import { setSelectedUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          console.log("suggested user data" + response.data.user);
          dispatch(setSelectedUser(response.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
