import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import MainLayout from "./Layout/MainLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import JobMain from "./Layout/JobMain.jsx";
import JobPage from "./pages/JobPage";
import CreateJob from "./components/CreateJob.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import SeeAllApplication from "./pages/SeeAllApplication.jsx";
import Application from "./pages/Application.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import ChatMain from "./pages/Chat.jsx";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import { io } from "socket.io-client";
const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "edit",
        element: <EditProfile />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/jobs",
    element: <JobMain />,
    children: [
      {
        path: "",
        element: <JobPage />,
      },
      {
        path: "create",
        element: <CreateJob />,
      },
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "allapplication",
        element: <SeeAllApplication />,
      },
      {
        path: ":id",
        element: <Application />,
      },
      {
        path: "myjobs",
        element: <MyJobs />,
      },
      {
        path: "myapplications",
        element: <MyApplications />,
      },
    ],
  },
  {
    path: "/chats",
    element: <ChatMain />,
  },
]);
const App = () => {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io(`${import.meta.env.VITE_BACKEND_INITIAL}`, {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={BrowserRouter} />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
