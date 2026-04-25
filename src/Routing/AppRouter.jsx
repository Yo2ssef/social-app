import { createBrowserRouter } from "react-router";
import Layout from "./../Components/Layout/Layout";
import Posts from "../Pages/Posts/Posts";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import NotFound from './../Pages/NotFound/NotFound';
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./AuthProtectedRoute/AuthProtectedRoute";
import AllComments from './../Pages/AllComments/AllComments';
import ProfileUser from "../Pages/ProfileUser/ProfileUser";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import BookMarks from "../Pages/BookMarks/BookMarks";
import ProfileAllUsers from "../Pages/ProfileAllUsers/ProfileAllUsers";
import Notifications from "../Pages/Notifications/Notifications";

export const myRouter = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      // Main Feed Routes
      { index: true, element: <ProtectedRoute><Posts /></ProtectedRoute> },
      { path: "posts", element: <ProtectedRoute><Posts /></ProtectedRoute> },
      
      // Post & User Details
      { path: "post-details/:id", element: <ProtectedRoute><AllComments /></ProtectedRoute> },
      { path: "profile-user/:id", element: <ProtectedRoute><ProfileAllUsers /></ProtectedRoute> },
      
      // Personal Profile Routes
      { path: "profile", element: <ProtectedRoute><ProfileUser /></ProtectedRoute> },
      { path: "bookmarks", element: <ProtectedRoute><BookMarks /></ProtectedRoute> },
      { path: "change-password", element: <ProtectedRoute><ChangePassword /></ProtectedRoute> },
      { path: "notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      
      // Auth Routes
      { path: "login", element: <AuthProtectedRoute><Login /></AuthProtectedRoute> },
      { path: "register", element: <AuthProtectedRoute><Register /></AuthProtectedRoute> },
      
      // Fallback Route
      { path: "*", element: <NotFound /> }
    ]
  },
]);