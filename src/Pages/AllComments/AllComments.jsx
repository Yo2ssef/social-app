import axios from "axios";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { ArrowLeft } from "iconsax-reactjs";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";

export default function AllComments() {
  // Hooks & Params
  const { id } = useParams();

  // API: Fetch Single Post Details
  function getSinglePostDetails() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });
  }

  // Query Hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singlePost", id],
    queryFn: getSinglePostDetails,
    select: (res) => res.data.data.post,
  });

  // Render: Loading State
  if (isLoading) {
    return (
      <div className="w-[95%] lg:w-170 mx-auto mt-6 space-y-6">
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl overflow-hidden p-0 mb-4">
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
          <div className="px-4 py-4 space-y-4 border-t border-gray-200/40 dark:border-slate-700/40 bg-gray-50/20 dark:bg-slate-800/20">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 w-full">
                <Skeleton
                  circle
                  width={32}
                  height={32}
                  baseColor="#f0f2f5"
                  className="shrink-0 mt-1"
                />
                <div className="flex flex-col w-[70%]">
                  <Skeleton height={60} borderRadius={24} baseColor="#f0f2f5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render: Error State
  if (isError) {
    return (
      <h1 className="text-center text-2xl mt-5 text-red-500">
        {error.message}
      </h1>
    );
  }

  // Main Render
  return (
    <>
      <title>Comments Post</title>

      {/* Navigation: Back Button */}
      <div className="container mx-auto lg:px-75 md:px-10 px-4">
        <Link
          className="my-6 inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-800/90 px-5 py-2.5 rounded-full transition-all w-fit group"
          to="/posts"
        >
          <ArrowLeft
            size="24"
            className="text-[#1877f2] group-hover:-translate-x-1 transition-transform"
            variant="TwoTone"
          />
          <span className="font-bold text-gray-700 dark:text-slate-200 text-sm tracking-wide">
            Back to posts
          </span>
        </Link>
      </div>

      {/* Content: Post and Comments Section */}
      <div className="min-h-screen my-6 w-[95%] lg:w-170 mx-auto">
        <CardsPosts id userPosts={data} />
      </div>
    </>
  );
}
