import axios from "axios";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { ArrowLeft, Bookmark } from "lucide-react";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";

export default function BookMarks() {
  // API: Fetch All Bookmarks logic
  async function getAllBookmarks() {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/bookmarks`,
      { headers: { token: localStorage.getItem("token") } },
    );
    return data;
  }

  // Query Hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userBookmarks"],
    queryFn: getAllBookmarks,
    select: (res) => res.data.bookmarks,
  });

  // Render: Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="w-[95%] lg:w-170 mx-auto mt-6 space-y-6">
        <div className="flex items-center gap-4 mb-6 px-2">
          <Skeleton circle width={45} height={45} baseColor="#f0f2f5" />
          <Skeleton
            width={180}
            height={30}
            baseColor="#f0f2f5"
            borderRadius={8}
          />
        </div>

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

  // Render: Error State
  if (isError) {
    return (
      <div className="w-[95%] lg:w-170 mx-auto mt-10">
        <div className="bg-red-50 text-red-500 rounded-2xl p-6 text-center border border-red-100 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Oops! Something went wrong
          </h2>
          <p>{error?.message || "Failed to load your bookmarks."}</p>
          <Link
            to="/posts"
            className="inline-block mt-4 text-[#1877f2] font-semibold hover:underline"
          >
            Go back to feed
          </Link>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <>
      <title>Bookmarks</title>
      <div className="w-full flex flex-col items-center p-4 md:py-8 mt-2">
        <div className="w-[95%] lg:w-170 space-y-6">
          {/* Page Header Section */}
          <div className="flex items-center justify-between mb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <Link
                to="/posts"
                className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-slate-300 shadow-inner"
              >
                <ArrowLeft size={22} />
              </Link>
              <div>
                <h1 className="text-[20px] md:text-2xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                  <Bookmark
                    className="text-amber-500 fill-amber-500 drop-shadow-sm"
                    size={24}
                  />
                  Your Bookmarks
                </h1>
                <p className="text-[13px] text-gray-500 dark:text-slate-400 font-medium mt-0.5">
                  {data?.length === 1
                    ? "1 saved post"
                    : `${data?.length || 0} saved posts`}
                </p>
              </div>
            </div>
          </div>

          {/* Bookmarks Feed Section */}
          <div className="flex flex-col gap-2">
            {data && data.length > 0 ? (
              data.map((post) => <CardsPosts key={post._id} userPosts={post} />)
            ) : (
              /* Empty State UI */
              <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-inner mt-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-slate-600">
                  <Bookmark size={36} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-slate-200 mb-2">
                  No Bookmarks Yet
                </h2>
                <p className="text-gray-500 dark:text-slate-400 max-w-[320px] mx-auto mb-8 font-medium">
                  Save your favorite posts to read them later. They'll be safely
                  kept here!
                </p>
                <Link
                  to="/posts"
                  className="px-6 py-3.5 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:scale-95"
                >
                  Go Explore Posts
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
