import axios from "axios";
import { Link, useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "iconsax-reactjs";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";
import BtnFollowAndUnfollow from "../../Components/BtnFollowAndUnfollow/BtnFollowAndUnfollow";

export default function ProfileAllUsers() {
  // Hooks & Params
  const { id } = useParams();

  // API: Fetch Profile Logic
  async function getSingleProfileDetails() {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/${id}/profile`,
      { headers: { token: localStorage.getItem("token") } },
    );
    return res;
  }

  // API: Fetch User Posts
  async function getPostsOneUser() {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/${id}/posts`,
      { headers: { token: localStorage.getItem("token") } },
    );
    return res;
  }

  // Query Hooks
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singleProfile", id],
    queryFn: getSingleProfileDetails,
    select: (res) => res?.data?.data,
  });

  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsIsError,
    error: postsError,
  } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: getPostsOneUser,
    select: (res) => res?.data?.data?.posts,
  });

  // Data Destructuring
  const {
    name,
    email,
    username,
    photo,
    cover,
    createdAt,
    dateOfBirth,
    gender,
    followersCount,
    followingCount,
  } = data?.user || {};

  const isFollowing = data?.isFollowing;

  // Render: Loading State
  if (isLoading) {
    return (
      <div className="max-w-212.5 mx-auto w-full mt-2 sm:mt-6 flex flex-col pb-10 px-0 sm:px-4">
        <div className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl sm:border border-white/60 dark:border-slate-700/60 sm:rounded-4xl overflow-hidden relative">
          <div className="w-full h-50 sm:h-65 bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="px-5 sm:px-10 relative pb-10">
            <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-3">
              <div className="relative z-10 w-fit h-fit rounded-full border-4 sm:border-[6px] border-white dark:border-slate-800 bg-white dark:bg-slate-800">
                <Skeleton
                  circle
                  className="w-30 h-30 sm:w-37.5 sm:h-37.5"
                  baseColor="#f0f2f5"
                />
              </div>
            </div>
            <div className="mt-2 text-left">
              <Skeleton
                width={200}
                height={32}
                baseColor="#f0f2f5"
                className="mb-2"
              />
              <Skeleton width={120} height={16} baseColor="#f0f2f5" />
            </div>
            <div className="flex items-center gap-6 mt-4 pt-1">
              <Skeleton width={80} height={20} baseColor="#f0f2f5" />
              <Skeleton width={80} height={20} baseColor="#f0f2f5" />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 pt-5 border-t border-gray-100/80 dark:border-slate-700/80">
              <Skeleton width={150} height={16} baseColor="#f0f2f5" />
              <Skeleton width={150} height={16} baseColor="#f0f2f5" />
              <Skeleton width={150} height={16} baseColor="#f0f2f5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render: Error State
  if (isError) {
    return (
      <div className="max-w-212.5 mx-auto w-full mt-10 px-4">
        <div className="bg-red-50 text-red-500 rounded-2xl p-6 text-center border border-red-100 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Oops! User not found</h2>
          <p>{error?.message || "Failed to load user profile."}</p>
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
      <title>Profile {name || "User"}</title>
      <div className="py-7">
        <div className="max-w-212.5 mx-auto w-full mt-2 sm:mt-6 flex flex-col pb-10 px-0 sm:px-4">
          {/* Profile Card Section */}
          <div className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl sm:border border-white/60 dark:border-slate-700/60 sm:rounded-4xl overflow-hidden relative">
            {/* Cover Image */}
            <div className="w-full h-50 sm:h-65 bg-linear-to-r from-blue-100 dark:from-slate-800 to-cyan-50 dark:to-slate-900 relative">
              {cover && (
                <img
                  src={cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <Link
                to="/posts"
                className="absolute top-4 left-4 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-sm"
              >
                <ArrowLeft size="20" color="white" />
                <span className="hidden sm:inline font-medium text-sm">
                  Back to Home
                </span>
              </Link>
            </div>

            {/* Profile Header (Avatar & Follow Btn) */}
            <div className="px-5 sm:px-10 relative pb-10">
              <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-3">
                <div className="relative z-10 w-fit h-fit rounded-full border-4 sm:border-[6px] border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-800">
                  <img
                    alt="Avatar"
                    className="object-cover rounded-full w-30 h-30 sm:w-37.5 sm:h-37.5"
                    src={
                      photo ||
                      "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                    }
                  />
                </div>
                <div className="self-end mb-1 sm:mb-3">
                  <BtnFollowAndUnfollow isFollowing={isFollowing} id={id} />
                </div>
              </div>

              {/* Profile Names */}
              <div className="mt-2 text-left">
                <h2 className="text-2xl sm:text-[32px] font-extrabold text-gray-900 dark:text-slate-100 tracking-tight leading-tight">
                  {name}
                </h2>
                <p className="text-gray-500 dark:text-slate-400 font-medium text-[16px] mt-0.5">
                  @{username}
                </p>
              </div>

              {/* Social Stats */}
              <div className="flex items-center gap-6 mt-4 pt-1">
                <div className="flex items-center gap-1.5 cursor-pointer hover:underline underline-offset-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    {followingCount || 0}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Following
                  </span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:underline underline-offset-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    {followersCount || 0}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Followers
                  </span>
                </div>
              </div>

              {/* Detailed Info Grid */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 pt-5 border-t border-gray-100/80 dark:border-slate-700/80 text-[15px]">
                {email && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 dark:text-slate-500 font-medium">
                      Email:
                    </span>
                    <span className="text-gray-700 dark:text-slate-300 font-semibold">
                      {email}
                    </span>
                  </div>
                )}
                {dateOfBirth && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 dark:text-slate-500 font-medium">
                      Born:
                    </span>
                    <span className="text-gray-700 dark:text-slate-300 font-semibold">
                      {new Date(dateOfBirth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {gender && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 dark:text-slate-500 font-medium">
                      Gender:
                    </span>
                    <span className="text-gray-700 dark:text-slate-300 font-semibold capitalize">
                      {gender}
                    </span>
                  </div>
                )}
                {createdAt && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 dark:text-slate-500 font-medium">
                      Joined:
                    </span>
                    <span className="text-gray-700 dark:text-slate-300 font-semibold">
                      {new Date(createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Posts List Section */}
          <div className="max-w-212.5 mx-auto w-full px-0 sm:px-4 mt-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4 px-4 sm:px-0">
              Posts
            </h3>

            {/* Posts Loading Skeletons */}
            {postsLoading && (
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[95%] lg:w-170 mx-auto bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl overflow-hidden p-0"
                  >
                    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                      <Skeleton
                        circle
                        width={40}
                        height={40}
                        baseColor="#f0f2f5"
                      />
                      <div className="flex flex-col gap-1">
                        <Skeleton width={120} height={14} baseColor="#f0f2f5" />
                        <Skeleton width={80} height={12} baseColor="#f0f2f5" />
                      </div>
                    </div>
                    <div className="px-4 pb-3">
                      <Skeleton count={2} height={14} baseColor="#f0f2f5" />
                    </div>
                    {i !== 1 && (
                      <Skeleton
                        height={250}
                        borderRadius={0}
                        baseColor="#f0f2f5"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Posts Feed Handling */}
            {postsIsError && (
              <div className="w-[95%] lg:w-170 mx-auto bg-red-50 text-red-500 rounded-2xl p-6 text-center border border-red-100 shadow-sm">
                <p className="text-sm">
                  {postsError?.message || "Failed to load posts."}
                </p>
              </div>
            )}

            {!postsLoading && !postsIsError && posts?.length === 0 && (
              <div className="w-[95%] lg:w-170 mx-auto bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl p-10 text-center">
                <p className="text-gray-400 font-medium text-lg">
                  No posts yet
                </p>
              </div>
            )}

            {!postsLoading &&
              !postsIsError &&
              posts?.length > 0 &&
              posts.map((post) => (
                <CardsPosts key={post._id} userPosts={post} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
