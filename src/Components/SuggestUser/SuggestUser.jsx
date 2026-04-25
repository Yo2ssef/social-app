import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Avatar, ScrollShadow } from "@heroui/react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router";

export default function SuggestUser() {
  // Fetching logic
  async function getFollowSuggestions() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/suggestions?limit=10`,
      { headers: { token: localStorage.getItem("token") } },
    );
    return response;
  }

  // Query Hook
  const { data, isLoading } = useQuery({
    queryKey: ["followSuggestions"],
    queryFn: getFollowSuggestions,
    select: (data) => data.data.data.suggestions,
  });

  // Render: Loading State
  if (isLoading)
    return (
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl p-5">
        <Skeleton
          width={150}
          height={20}
          baseColor="#f0f2f5"
          className="mb-4 ml-1"
        />
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Skeleton circle width={40} height={40} baseColor="#f0f2f5" />
                <div className="flex flex-col gap-2">
                  <Skeleton width={100} height={8} baseColor="#f0f2f5" />
                  <Skeleton width={70} height={6} baseColor="#f0f2f5" />
                </div>
              </div>
              <Skeleton
                width={70}
                height={28}
                style={{ borderRadius: "999px" }}
                baseColor="#f0f2f5"
              />
            </div>
          ))}
        </div>
      </div>
    );

  // Main Render
  return (
    <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl p-5">
      <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4 px-1">
        Suggestions for you
      </h3>

      <ScrollShadow className="w-full max-h-87.5 pr-2">
        <div className="flex flex-col gap-3">
          {data?.map((user) => (
            <Link
              to={`/profile-user/${user._id}`}
              key={user._id}
              className="flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all cursor-pointer group"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar
                  isBordered
                  color="default"
                  radius="full"
                  size="md"
                  src={user.photo}
                  className="transition-transform group-hover:scale-105"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-200 line-clamp-1 w-28">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    Suggested for you
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
