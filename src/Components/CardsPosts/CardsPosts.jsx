import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Form,
  Image,
  Input,
} from "@heroui/react";
import { Link } from "react-router";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CloseCircle, Messages1 } from "iconsax-reactjs";
import { Heart, Bookmark, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import CommentsCard from "../CommentsCard/CommentsCard";
import CreateComment from "../CreateComment/CreateComment";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import imgUser from "../../../public/defUser.png";

export default function CardsPosts({ userPosts, id }) {
  // Hooks & Local States
  const queryClient = useQueryClient();
  const [updatePost, setupdatePost] = useState(false);
  const { userData } = useContext(AuthUserContext) || {};
  const idUserPost = userData?.user?._id;

  // Destructuring Post Data
  const {
    body,
    user: { name, photo, _id: idUsersPosts },
    createdAt,
    commentsCount = 0,
    image,
    _id,
    topComment,
    likesCount = 0,
    bookmarked = false,
    likes,
  } = userPosts;

  const isLiked = likes?.includes(idUserPost);

  // Form Management
  const { handleSubmit, register, reset } = useForm({
    defaultValues: { body: "" },
  });

  // API: Update Post
  function sendUpdatePost({data, postId}) {
    const myFormData = new FormData();
    if (data.body.trim() !== "") {
      myFormData.append("body", data.body);
    }
    return axios.put(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
      myFormData,
      { headers: { token: localStorage.getItem("token") } },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sendUpdatePost,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      reset();
      setupdatePost(false);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update post");
    },
  });

  // API: Get Comments
  function getAllComments() {
    return axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${_id}/comments?page=1&limit=${commentsCount}`,
      { headers: { token: localStorage.getItem("token") } },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allComments", _id],
    queryFn: getAllComments,
    enabled: !!id,
    select: (data) => data.data.data.comments,
  });

  // API: Like Post
  const { mutate: handleLike } = useMutation({
    mutationFn: () => {
      const promise = axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${_id}/like`,
        {},
        { headers: { token: localStorage.getItem("token") } },
      );
      toast.promise(promise, {
        loading: "Updating...",
        success: (res) => res.data?.message || "Done!",
        error: (err) => err.response?.data?.message || "Something went wrong",
      });
      return promise;
    },
    onSuccess: () => queryClient.invalidateQueries(["allPosts"]),
  });

  // API: Bookmark Post
  const { mutate: handleBookmark } = useMutation({
    mutationFn: () => {
      const promise = axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${_id}/bookmark`,
        {},
        { headers: { token: localStorage.getItem("token") } },
      );
      toast.promise(promise, {
        loading: "Updating...",
        success: (res) => res.data?.message || "Done!",
        error: (err) => err.response?.data?.message || "Something went wrong",
      });
      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allPosts"]);
      queryClient.invalidateQueries(["userBookmarks"]);
    },
  });

  // API: Delete Post
  function deleteUserPost(postId) {
    const promise = axios.delete(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
      { headers: { token: localStorage.getItem("token") } },
    );

    toast.promise(promise, {
      loading: "Deleting post...",
      success: (data) => {
        queryClient.invalidateQueries({ queryKey: ["allPosts"] });
        return data.data.message;
      },
      error: (err) => err.response?.data?.message || "Failed to delete post",
    });
  }

  // Render: Loading State
  if (id && isLoading) {
    return (
      <Card className="w-[95%] lg:w-170 mx-auto mt-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl overflow-hidden p-0 mb-4">
        <CardHeader className="flex justify-between items-center px-4 pt-4 pb-2">
          <div className="flex gap-2">
            <Image
              className="bg-gray-200 dark:bg-slate-700 rounded-full object-cover shrink-0 shadow-sm"
              alt={name}
              height={40}
              radius="sm"
              src={photo ? photo : imgUser}
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md font-semibold">{name}</p>
              <p className="text-small text-default-500 dark:text-slate-400">
                {new Date(createdAt).toLocaleDateString("en-CA")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col px-0 py-0 overflow-visible">
          <div className="px-4 pb-3">
            <p className="text-left text-[15px] text-[#1c1e21] dark:text-slate-100 capitalize leading-relaxed">
              {body || " "}
            </p>
          </div>
          {image && (
            <div className="w-full relative shadow-inner bg-black/5 flex justify-center items-center overflow-hidden">
              <Image
                alt={body}
                src={image}
                radius="none"
                classNames={{
                  wrapper: "!max-w-full w-full h-full",
                  img: "w-full h-auto object-contain max-h-[600px]",
                }}
              />
            </div>
          )}
        </CardBody>
        <div className="px-4 py-4 space-y-4 border-t border-gray-200/40 dark:border-slate-700/40 bg-gray-50/20 dark:bg-slate-800/40">
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
      </Card>
    );
  }

  // Render: Error State
  if (isError && id) {
    return <h1 className="text-center text-2xl mt-5">{error.message}</h1>;
  }

  // Main Render
  return (

      <Card className="w-[95%] lg:w-170 mx-auto mt-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl overflow-hidden p-0 mb-4">
        {/* Post Header */}
        <CardHeader className="flex justify-between items-center px-4 pt-4 pb-2">
          <Link
            to={
              userData?.user?.id === idUsersPosts
                ? "/profile"
                : `/profile-user/${idUsersPosts}`
            }
            className="flex gap-2"
          >
            <Image
              className="bg-gray-200 dark:bg-slate-700 rounded-full object-cover shrink-0 shadow-sm"
              alt={name}
              height={40}
              radius="sm"
              src={photo ? photo : imgUser}
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md font-semibold">{name}</p>
              <p className="text-small text-default-500 dark:text-slate-400">
                {new Date(createdAt).toLocaleDateString("en-CA")}
              </p>
            </div>
          </Link>

          {/* Post Actions (Edit/Delete) */}
          {idUserPost === idUsersPosts && (
            <Dropdown
              placement="bottom-end"
              classNames={{
                content:
                  "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-gray-200/60 dark:border-slate-700/60 shadow-[0_12px_40px_rgba(0,0,0,0.1)] rounded-2xl min-w-[220px] p-1.5",
              }}
            >
              <DropdownTrigger>
                <span className="p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-90 group">
                  <MoreHorizontal
                    size={20}
                    className="text-gray-500 dark:text-slate-400 group-hover:text-gray-800 dark:group-hover:text-slate-200 transition-colors"
                  />
                </span>
              </DropdownTrigger>
              <DropdownMenu aria-label="Post Actions" variant="flat">
                <DropdownItem
                  key="update"
                  startContent={
                    <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                      <Pencil size={16} className="text-amber-500" />
                    </div>
                  }
                  description="Edit your post content"
                  onClick={() => {
                    setupdatePost(true);
                    reset({ body: body });
                  }}
                >
                  Edit Post
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  className="text-danger"
                  startContent={
                    <div className="p-1.5 rounded-lg bg-red-50 border border-red-100">
                      <Trash2 size={16} className="text-red-500" />
                    </div>
                  }
                  description="Permanently remove this post"
                  onClick={() => deleteUserPost(_id)}
                >
                  Delete Post
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </CardHeader>

        {/* Post Body (Normal or Update Mode) */}
        <CardBody className="flex flex-col px-0 py-0 overflow-visible">
          {updatePost ? (
            <Form
              className="w-full flex flex-col gap-1"
              onSubmit={handleSubmit((data) => mutate({ data, postId: _id }))}
            >
              <div className="flex items-center gap-3 w-full px-4 pt-2">
                <Input
                  {...register("body")}
                  size="md"
                  variant="flat"
                  radius="full"
                  defaultValue={body}
                  type="text"
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 focus-within:bg-white dark:focus-within:bg-slate-700 transition-all shadow-none",
                    input: "dark:text-slate-100",
                  }}
                />
                <CloseCircle
                  size="32"
                  variant="Bulk"
                  className="cursor-pointer hover:scale-110 transition-all"
                  color="#E41E3F"
                  onClick={() => setupdatePost(false)}
                />
              </div>
              <Button
                type="submit"
                className="w-[98%] mx-auto my-4 font-semibold bg-[#1877f2] text-white rounded-xl"
                isLoading={isPending}
              >
                Update Your Post
              </Button>
            </Form>
          ) : (
            <div className="px-4 pb-3">
              <p className="text-left text-[15px] text-[#1c1e21] dark:text-slate-100 capitalize leading-relaxed">
                {body || " "}
              </p>
            </div>
          )}
          {image && (
            <div className="w-full relative shadow-inner bg-black/5 flex justify-center items-center overflow-hidden">
              <Image
                alt={body}
                src={image}
                radius="none"
                classNames={{
                  wrapper: "!max-w-full w-full h-full",
                  img: "w-full h-auto object-contain max-h-[600px]",
                }}
              />
            </div>
          )}
        </CardBody>

        {/* Post Interactions */}
        <div className="px-4 py-3 border-t border-gray-200/40 dark:border-slate-700/40 flex justify-between items-center bg-gray-50/30 dark:bg-slate-800/40 font-medium select-none">
          <div className="flex items-center gap-6">
            {/* Like Action */}
            <div
              onClick={handleLike}
              className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-red-500 group"
            >
              <Heart
                size={22}
                className={`transition-all ${isLiked ? "fill-red-500 text-red-500" : ""} group-hover:scale-110`}
              />
              <span className={`text-[15px] ${isLiked ? "text-red-500" : "text-gray-600"}`}>
                {likesCount > 0 && (
                  <span className="font-semibold">{likesCount}</span>
                )}{" "}
                {likesCount <= 1 ? "Like" : "Likes"}
              </span>
            </div>

            {/* Comments Action */}
            <div
              className={`flex items-center gap-1.5 transition-all duration-300 ${
                commentsCount > 1
                  ? "cursor-pointer text-gray-600 hover:text-blue-500 group"
                  : "text-gray-600 cursor-default"
              }`}
            >
              {(() => {
                const content = (
                  <>
                    <Messages1
                      size="22"
                      variant={commentsCount > 0 ? "Bulk" : "Linear"}
                      className={`transition-all ${
                        commentsCount > 1
                          ? commentsCount > 0
                            ? "text-blue-500 scale-110"
                            : "group-hover:scale-110"
                          : ""
                      }`}
                    />
                    <span className="text-[15px]">
                      {commentsCount > 0 && (
                        <span className="font-semibold">{commentsCount}</span>
                      )}{" "}
                      {commentsCount <= 1 ? "Comment" : "Comments"}
                    </span>
                  </>
                );

                return commentsCount > 1 ? (
                  <Link
                    to={`/post-details/${_id}`}
                    className="flex items-center gap-1.5"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">{content}</div>
                );
              })()}
            </div>
          </div>

          {/* Bookmark Action */}
          <div
            onClick={handleBookmark}
            className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-amber-500 group"
          >
            <Bookmark
              size={22}
              className={`transition-all ${bookmarked ? "fill-amber-500 text-amber-500 scale-110" : "group-hover:scale-110"}`}
            />
          </div>
        </div>

        {/* Display Comments */}
        {topComment && (
          <div className="px-4 pb-2 bg-gray-50/20 dark:bg-slate-800/40">
            {id && data ? (
              data.map((e) => <CommentsCard key={e._id} detComment={e} />)
            ) : (
              <CommentsCard detComment={topComment} />
            )}
          </div>
        )}

        {/* Add Comment Input */}
        <div className="px-4 pb-4 bg-gray-50/20 dark:bg-slate-800/40">
          <CreateComment id={_id} />
        </div>
      </Card>

  );
}
