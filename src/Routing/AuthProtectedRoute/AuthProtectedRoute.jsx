import { Navigate } from "react-router";

export default function AuthProtectedRoute({ children }) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  return children;
}
