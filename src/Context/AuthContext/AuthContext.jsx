import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AuthUserContext = createContext();

export default function AuthContext({ children }) {
  const [userData, setUserData] = useState(null);

  async function getUserData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
        {
          headers: { token },
        }
      );
      setUserData(data.data);
    } catch (error) {
      console.log("Auth Error:", error);
      setUserData(null);
    }
  }

  useEffect(() => {
    getUserData();
  }, []); 

  const tokenUp = { userData, setUserData, getUserData };

  return (
    <AuthUserContext.Provider value={tokenUp}>
      {children}
    </AuthUserContext.Provider>
  );
}