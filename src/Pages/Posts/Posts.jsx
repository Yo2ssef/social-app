import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";
import CreatePost from "../../Components/CreatePost/CreatePost";
import SuggestUser from "../../Components/SuggestUser/SuggestUser";
import { useNavigate } from "react-router";
import { Button } from "@heroui/react";

export default function Posts() {
  const navigate = useNavigate();

  // API: Fetch all posts logic
  function getAllPosts() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
      headers: { token: localStorage.getItem("token") },
    });
  }

  // Query Hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
    select: (res) => res?.data?.data?.posts,
  });

  // Logout handler
  const handleLogoutAndRedirect = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Render: Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="w-[95%] lg:w-170 mx-auto mt-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl overflow-hidden p-0 mb-4"
          >
            <div className="flex justify-between items-center px-4 pt-4 pb-2">
              <div className="flex gap-2">
                <Skeleton circle width={40} height={40} baseColor="#f0f2f5" />
                <div className="flex flex-col gap-1 mt-1">
                  <Skeleton width={120} height={10} baseColor="#f0f2f5" />
                  <Skeleton width={80} height={8} baseColor="#f0f2f5" />
                </div>
              </div>
            </div>
            <div className="px-4 pb-3 mt-2">
              <Skeleton count={2} className="mb-1" baseColor="#f0f2f5" />
            </div>
            <Skeleton
              height={250}
              className="rounded-none w-full"
              baseColor="#f0f2f5"
            />
          </div>
        ))}
      </div>
    );
  }

  // Render: Error State (Handling 401 Session Expired)
  if (isError) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    return (
      <div className="text-center mt-5">
        <h1 className="text-red-500 text-2xl mb-4">
          {error?.response?.status === 401
            ? "Session Expired"
            : "Something went wrong"}
        </h1>
        <Button
          variant="ghost"
          onClick={handleLogoutAndRedirect}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  // Main Render
  return (
    <>
      <title>All Posts</title>

      <div className="max-w-287.5 mx-auto w-full flex justify-center gap-6 lg:gap-10 md:py-8">
        {/* Main Content: Create Post and Feed */}
        <div className="w-full max-w-170 flex-1 flex flex-col">
          <div className="mb-8 drop-shadow-sm">
            <CreatePost />
          </div>

          <div className="flex flex-col gap-8">
            {data.map((post) => (
              <CardsPosts key={post._id} userPosts={post} />
            ))}
          </div>
        </div>

        {/* Sidebar: Suggestions */}
        <div className="hidden md:block md:w-75 lg:w-70 shrink-0 sticky top-24 self-start">
          <div className="flex flex-col gap-6">
            <SuggestUser />
          </div>
        </div>
      </div>
    </>
  );
}
