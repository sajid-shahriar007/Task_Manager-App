import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root"; // fixed: folder is "Layout" (capital L), not "layout"
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
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
      { path: "/", element: <Home></Home> },
      { path: "/taskmanager", element: <PrivateRoute><TaskManager></TaskManager></PrivateRoute> },
      { path: "/about", element: <About></About> },
      { path: "login", element: <Login/> },
      { path: "signup", element: <SignUp /> }
    ],
  },
]);
