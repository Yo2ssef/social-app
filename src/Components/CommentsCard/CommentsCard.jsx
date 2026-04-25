import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Form,
  Input,
  Button,
  Spinner,
} from "@heroui/react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Reply,
  ChevronDown,
  ChevronUp,
  MessageSquareMore,
} from "lucide-react";
import { AuthUserContext } from "./../../Context/AuthContext/AuthContext";
import CreateReplay from "../CreateReplay/CreateReplay";

export default function CommentsCard({ detComment }) {
  // Data Destructuring
  const {
    content,
    commentCreator: { name, photo, _id: idUsersComments },
    createdAt,
    post: idPost,
    _id: idComment,
  } = detComment;

  // Hooks & States
  const { userData } = useContext(AuthUserContext) || {};
  const idUser = userData?.user?._id;
  const [updateComment, setupdateComment] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showRepliesUser, setShowReplieUser] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  // API: Update Comment logic
  function sendUpdateComment(data) {
    const myFormData = new FormData();
    if (data.content.trim() !== "") {
      myFormData.append("content", data.content);
    }
    return axios.put(
      `${import.meta.env.VITE_BASE_URL}/posts/${idPost}/comments/${idComment}`,
      myFormData,
      { headers: { token: localStorage.getItem("token") } },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sendUpdateComment,
    onSuccess: ({ data }) => {
      toast.success(data.message);
      reset();
      setupdateComment(false);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["allComments", idPost] });
      queryClient.invalidateQueries({ queryKey: ["singlePost", idPost] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update comment");
    },
  });

  // API: Delete Comment logic
  function deleteUserComment() {
    const promise = axios.delete(
      `${import.meta.env.VITE_BASE_URL}/posts/${idPost}/comments/${idComment}`,
      { headers: { token: localStorage.getItem("token") } },
    );

    toast.promise(promise, {
      loading: "Deleting Comment...",
      success: (data) => {
        queryClient.invalidateQueries({ queryKey: ["allPosts"] });
        queryClient.invalidateQueries({ queryKey: ["allComments", idPost] });
        queryClient.invalidateQueries({ queryKey: ["singlePost", idPost] });
        return data.data.message;
      },
      error: (err) => err.response?.data?.message || "Failed to delete comment",
    });
  }

  // API: Fetch Replies
  function getRepliesComment() {
    return axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${idPost}/comments/${idComment}/replies?page=1&limit=10`,
      { headers: { token: localStorage.getItem("token") } },
    );
  }

  const { data, isLoading: repliesLoading } = useQuery({
    queryKey: ["replies", idComment],
    queryFn: getRepliesComment,
    enabled: !!idPost,
    select: (data) => data.data.data.replies,
  });

  return (
    <div className="flex gap-3 w-full my-4">
      {/* User Avatar Section */}
      <Link
        to={
          idUser === idUsersComments
            ? "/profile"
            : `/profile-user/${idUsersComments}`
        }
        className="shrink-0"
      >
        <Avatar
          radius="full"
          size="sm"
          src={photo}
          className="shrink-0 mt-1 shadow-sm"
        />
      </Link>

      {/* Main Comment Content */}
      <div className="flex flex-col max-w-[85%]">
        <div
          className={`relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md shadow-cyan-900/5 rounded-3xl rounded-tl-sm px-4 py-3 text-[#1c1e21] dark:text-slate-100 border border-white/50 dark:border-slate-700/50 ${!updateComment ? "pr-10" : ""}`}
        >
          <Link
            to={
              idUser === idUsersComments
                ? "/profile"
                : `/profile-user/${idUsersComments}`
            }
            className="text-[14px] font-bold leading-tight hover:underline cursor-pointer text-gray-800 dark:text-slate-200"
          >
            {name}
          </Link>

          {/* Edit Form or Text Content */}
          {updateComment ? (
            <Form
              className="w-full flex flex-col gap-2 mt-1"
              onSubmit={handleSubmit((data) => mutate(data))}
            >
              <div className="flex items-center gap-2 w-full">
                <Input
                  {...register("content")}
                  size="sm"
                  variant="flat"
                  radius="full"
                  defaultValue={content}
                  type="text"
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200/60 dark:hover:bg-slate-700/60 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all shadow-none h-8",
                    input: "text-[13px]",
                  }}
                />
                <span
                  className="p-1 rounded-full cursor-pointer hover:bg-red-50 transition-all active:scale-90"
                  onClick={() => {
                    setupdateComment(false);
                    reset();
                  }}
                >
                  <X size={16} className="text-red-500" />
                </span>
              </div>
              <Button
                type="submit"
                size="sm"
                className="w-full font-semibold bg-[#1877f2] text-white rounded-xl text-[12px] h-7"
                isLoading={isPending}
              >
                Update Comment
              </Button>
            </Form>
          ) : (
            <p className="text-[15px] leading-relaxed wrap-break-words mt-1 text-gray-700 dark:text-slate-300">
              {content}
            </p>
          )}

          {/* Settings Dropdown (Owner Only) */}
          {idUser === idUsersComments && (
            <Dropdown
              placement="bottom-end"
              classNames={{
                content:
                  "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-gray-200/60 dark:border-slate-700/60 shadow-[0_12px_40px_rgba(0,0,0,0.1)] rounded-2xl min-w-[200px] p-1.5",
              }}
            >
              <DropdownTrigger>
                <span className="absolute top-2 right-2 p-1.5 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-90 group">
                  <MoreHorizontal
                    size={18}
                    className="text-gray-400 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-200 transition-colors"
                  />
                </span>
              </DropdownTrigger>
              <DropdownMenu aria-label="Comment Actions" variant="flat">
                <DropdownItem
                  key="edit"
                  startContent={
                    <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                      <Pencil size={14} className="text-amber-500" />
                    </div>
                  }
                  onClick={() => {
                    setupdateComment(true);
                    reset({ content: content });
                  }}
                >
                  Edit Comment
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  className="text-danger"
                  startContent={
                    <div className="p-1.5 rounded-lg bg-red-50 border border-red-100">
                      <Trash2 size={14} className="text-red-500" />
                    </div>
                  }
                  onClick={deleteUserComment}
                >
                  Delete Comment
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        {/* Date and Reply Button */}
        <div className="flex gap-4 items-center text-[12px] text-gray-500 dark:text-slate-400 font-semibold mt-1.5 ml-3">
          <span className="font-normal text-gray-400 dark:text-slate-500 drop-shadow-none cursor-default">
            {new Date(createdAt).toLocaleDateString("en-CA")}
          </span>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className={`flex items-center gap-1.5 transition-all duration-200 font-semibold cursor-pointer ${!showReplies ? "text-blue-600 hover:text-blue-700 hover:underline" : "text-red-500 hover:text-red-600 hover:underline"}`}
          >
            {!showReplies ? (
              <>
                <Reply size={16} />
                <span>Reply</span>
              </>
            ) : (
              <>
                <X size={16} />
                <span>Cancel</span>
              </>
            )}
          </button>
        </div>

        {/* Replies Toggle Button */}
        {data?.length > 0 && (
          <div className="ml-3 mt-1">
            <button
              onClick={() => setShowReplieUser(!showRepliesUser)}
              className={`flex items-center gap-1.5 text-[12.5px] font-bold transition-all duration-200 cursor-pointer ${!showRepliesUser ? "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400" : "text-red-500 hover:text-red-600"}`}
            >
              <MessageSquareMore size={14} className="opacity-80" />
              <span>
                {!showRepliesUser
                  ? `View ${data.length} replies`
                  : "Hide replies"}
              </span>
              {!showRepliesUser ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronUp size={14} />
              )}
            </button>
          </div>
        )}

        {/* Replies List Section */}
        {showRepliesUser && (
          <div className="ml-4 mt-1.5 border-l border-gray-200/50 dark:border-slate-700/50 pl-2.5 flex flex-col gap-2">
            {repliesLoading ? (
              <div className="mt-2 ml-2">
                <Spinner size="sm" color="primary" />
              </div>
            ) : (
              <div className="space-y-1">
                {data?.map((reply) => (
                  <div
                    key={reply._id || reply.id}
                    className="flex gap-2 items-start"
                  >
                    <Link
                      to={
                        idUser === reply.commentCreator?._id
                          ? "/profile"
                          : `/profile-user/${reply.commentCreator?._id}`
                      }
                      className="shrink-0"
                    >
                      <Avatar
                        radius="full"
                        src={reply.commentCreator?.photo}
                        className="w-6 h-6 mt-0.5"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <div className="bg-gray-100/60 dark:bg-slate-800/60 rounded-xl rounded-tl-sm px-2.5 py-1.5">
                        <Link
                          to={
                            idUser === reply.commentCreator?._id
                              ? "/profile"
                              : `/profile-user/${reply.commentCreator?._id}`
                          }
                          className="text-[11px] font-semibold hover:underline text-gray-600 dark:text-slate-300"
                        >
                          {reply.commentCreator?.name}
                        </Link>
                        <p className="text-[12px] wrap-break-words text-gray-500 dark:text-slate-400">
                          {reply.content}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 ml-1.5">
                        {new Date(reply.createdAt).toLocaleDateString("en-CA")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Reply Form */}
        {showReplies && (
          <div className="w-full">
            <CreateReplay idPost={idPost} idComment={idComment} />
          </div>
        )}
      </div>
    </div>
  );
}
