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

export const myRouter = createBrowserRouter([
  { path: "", element: <Layout />, children: [
    {index: true, element: <ProtectedRoute><Posts/></ProtectedRoute>},
    {path: "posts", element: <ProtectedRoute><Posts/></ProtectedRoute>},
    {path: "postDetails/:id", element: <ProtectedRoute><AllComments/></ProtectedRoute>},
    {path: "profile", element: <ProtectedRoute><ProfileUser/></ProtectedRoute>},
    {path: "change-password", element: <ProtectedRoute><ChangePassword/></ProtectedRoute>},
    {path: "login", element: <AuthProtectedRoute><Login/></AuthProtectedRoute>},
    {path: "register", element: <AuthProtectedRoute><Register/></AuthProtectedRoute>},
    {path: "*", element: <NotFound/>}
  ]},
]);
