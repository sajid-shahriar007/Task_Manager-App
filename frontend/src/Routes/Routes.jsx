import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "../Layout/Root"; 
import DashboardLayout from "../Layout/DashboardLayout";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import TaskManager from "../pages/TaskManager/TaskManager";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import About from "../pages/About/About";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "/about", element: <About /> },
      { path: "login", element: <Login/> },
      { path: "signup", element: <SignUp /> }
    ],
  },
  {
    path: "/taskmanager",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { path: "", element: <TaskManager /> }
    ]
  }
]);
