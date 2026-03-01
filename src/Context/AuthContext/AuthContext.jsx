import axios from "axios";
import { createContext, useState } from "react";

export const AuthUserContext = createContext();

export default function AuthContext({ children }) {
  const [userData, setUserData] = useState(function () {
    return getUserData();
  });

  async function getUserData() {
    try {
      const {
        data: { data: user },
      } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      setUserData(user);
      return user;
    } catch (error) {
      setUserData(null);
      return null && console.log(error);
    }
  }
  const tokenUp = { userData, setUserData, getUserData };

  return <AuthUserContext value={tokenUp}>{children}</AuthUserContext>;
}
