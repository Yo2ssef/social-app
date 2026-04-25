import { createContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const NotificationContContext = createContext();

export default function NotificationProvider({ children }) {
  const getNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/notifications?unread=false&page=1&limit=20`,
      { headers: { token } },
    );
    return res?.data?.data?.notifications || [];
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const unreadCount = useMemo(() => {
    return data?.length || 0;
  }, [data]);

  const value = {
    notifications: data || [],
    unreadCount,
    isLoading,
    isError,
    refetch,
  };

  return (
    <NotificationContContext.Provider value={value}>
      {children}
    </NotificationContContext.Provider>
  );
}
