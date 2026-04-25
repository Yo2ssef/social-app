import { useContext, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { ArrowLeft, Logout } from "iconsax-reactjs";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import { useQuery } from "@tanstack/react-query";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";
import Skeleton from "react-loading-skeleton";

export default function ProfileUser() {
  // Hooks & Context
  const { userData, getUserData, setUserData } =
    useContext(AuthUserContext) || {};
  const photoUpload = useRef();
  const myNavigate = useNavigate();
  const [loadBtn, setLoadBtn] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // User Data Destructuring
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
    bookmarksCount,
    id,
  } = userData?.user || {};

  // API: Fetch Personal Posts
  async function getSingleProfileDetails() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/users/${id}/posts`, {
      headers: { token: localStorage.getItem("token") },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profileuser"],
    queryFn: getSingleProfileDetails,
    select: (res) => res?.data?.data?.posts,
  });

  // API: Upload Profile Picture
  async function handlePhotoUpload() {
    const myFormPhoto = new FormData();
    myFormPhoto.append("photo", photoUpload.current.files[0]);

    toast.promise(
      axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/upload-photo`,
        myFormPhoto,
        {
          headers: { token: localStorage.getItem("token") },
        },
      ),
      {
        loading: () => {
          setLoadBtn(true);
          return "Uploading Your Profile Picture";
        },
        success: ({ data }) => {
          getUserData();
          setLoadBtn(false);
          return data.message;
        },
        error: (err) => {
          setLoadBtn(false);
          console.log(err);
          return "Failed to Upload Profile Picture";
        },
      },
    );
  }

  const handleChangePass = () => myNavigate("/change-password");

  // Log Out Logic
  function setUserLogOut() {
    localStorage.removeItem("token");
    if (setUserData) setUserData(null);
    myNavigate("/login");
  }

  return (
    <>
      <title>Profile</title>
      <div className="max-w-212.5 mx-auto w-full mt-2 sm:mt-6 flex flex-col pb-10 px-0 sm:px-4">
        {/* Profile Card Header */}
        <div className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl sm:border border-white/60 dark:border-slate-700/60 sm:rounded-4xl overflow-hidden relative">
          {/* Cover Image Section */}
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

          {/* Profile Info & Action Buttons */}
          <div className="px-5 sm:px-10 relative pb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-3 sm:gap-0 -mt-16 sm:-mt-20 mb-3">
              <div className="relative z-10 w-fit h-fit rounded-full border-4 sm:border-[6px] border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-800">
                <img
                  alt={name}
                  className="object-cover rounded-full w-28 h-28 sm:w-37.5 sm:h-37.5"
                  src={
                    photo ||
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                  }
                />
              </div>

              {/* Profile Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-3 z-10 w-full sm:w-auto mt-1 sm:mt-0 pb-1">
                <Button
                  radius="full"
                  variant="bordered"
                  className="font-bold border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200"
                  onClick={() => photoUpload.current.click()}
                  size="sm"
                  isLoading={loadBtn}
                >
                  Change Photo
                </Button>
                <Button
                  color="primary"
                  radius="full"
                  className="font-bold shadow-md bg-[#1877f2]"
                  size="sm"
                  onClick={handleChangePass}
                >
                  Change Password
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  radius="full"
                  className="font-bold"
                  size="sm"
                  onPress={onOpen}
                  startContent={<Logout size="18" />}
                >
                  <span className="hidden min-[380px]:inline">Log Out</span>
                </Button>
              </div>
            </div>

            {/* Name & Handle */}
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
              <Link
                to="/bookmarks"
                className="flex items-center gap-1.5 hover:opacity-90"
              >
                <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  {bookmarksCount || 0}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Bookmarks
                </span>
              </Link>
            </div>

            {/* User Meta Data */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 pt-5 border-t border-gray-100/80 dark:border-slate-700/80 text-[15px]">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="text-gray-700 dark:text-slate-300 font-semibold">
                  {email}
                </span>
              </div>
              {dateOfBirth && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-medium">Born:</span>
                  <span className="text-gray-700 dark:text-slate-300 font-semibold">
                    {new Date(dateOfBirth).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-medium">Gender:</span>
                <span className="text-gray-700 dark:text-slate-300 font-semibold capitalize">
                  {gender}
                </span>
              </div>
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-medium">Joined:</span>
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
          <input
            type="file"
            className="hidden"
            onChange={handlePhotoUpload}
            ref={photoUpload}
            accept="image/*"
          />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center justify-center pt-8">
                <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-full mb-3">
                  <Logout size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">
                  Leaving so soon?
                </h2>
              </ModalHeader>
              <ModalBody className="text-center pb-6 px-8 text-gray-500">
                Are you sure you want to log out of your account?
              </ModalBody>
              <ModalFooter className="flex-col sm:flex-row gap-3 pb-8 px-8">
                <Button
                  className="w-full sm:w-1/2 font-bold"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="w-full sm:w-1/2 font-bold"
                  onPress={() => {
                    onClose();
                    setUserLogOut();
                  }}
                >
                  Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* User's Posts Feed */}
      <div className="w-full max-w-212.5 mx-auto flex flex-col gap-4 px-0 sm:px-4 pb-10">
        {isLoading && (
          <div className="w-[95%] lg:w-170 mx-auto space-y-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white/85 dark:bg-slate-900/85 shadow-lg rounded-3xl overflow-hidden p-0"
              >
                <div className="flex items-center gap-2 px-4 py-4">
                  <Skeleton circle width={40} height={40} baseColor="#f0f2f5" />
                  <div className="flex flex-col gap-1">
                    <Skeleton width={120} height={10} />
                    <Skeleton width={80} height={8} />
                  </div>
                </div>
                <div className="px-4 py-3">
                  <Skeleton count={2} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="w-[95%] lg:w-170 mx-auto bg-red-50 text-red-500 rounded-2xl p-6 text-center mt-4">
            <h4 className="font-semibold">Failed to load posts</h4>
            <p className="text-sm">
              {error?.message || "Something went wrong."}
            </p>
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="w-[95%] lg:w-170 mx-auto mt-4 bg-white/85 dark:bg-slate-900/85 shadow-lg rounded-3xl p-12 text-center">
            <p className="text-gray-500 dark:text-slate-200 font-bold text-xl">
              No posts yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Share something with your friends!
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          data?.length > 0 &&
          data.map((post) => <CardsPosts key={post._id} userPosts={post} />)}
      </div>
    </>
  );
}
