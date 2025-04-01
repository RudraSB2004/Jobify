import { setMessages } from "../redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/message/all/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages(); // <-- Call the fetchMessages function
  }, [selectedUser, dispatch]);
};

export default useGetAllMessages;
