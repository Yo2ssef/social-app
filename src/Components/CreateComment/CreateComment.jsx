import { Button, Form, Image, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";

export default function CreateComment({ id }) {
  // Hooks & Context
  const queryClient = useQueryClient();
  const { userData } = useContext(AuthUserContext) || {};
  const { name, photo } = userData?.user || {};

  // Form Config
  const { handleSubmit, register, reset } = useForm({
    defaultValues: { content: "" },
  });

  // API: Send Comment logic
  function sendUserComment(data) {
    const myFormData = new FormData();
    if (data.content.trim() !== "") {
      myFormData.append("content", data.content);
    }

    return axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts/${id}/comments`,
      myFormData,
      { headers: { token: localStorage.getItem("token") } },
    );
  }

  // Mutation logic
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendUserComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["allComments", id] });
      queryClient.invalidateQueries({ queryKey: ["singlePost", id] });
    },
  });

  // Handle Toast & Submission
  function toastHandle(data) {
    toast.promise(mutateAsync(data), {
      loading: <b>Creating Comment...</b>,
      success: (res) => {
        reset();
        return <b>{res.data.message}</b>;
      },
      error: (err) => {
        console.error(err);
        return <b>{err.message || "Failed to Create Comment"}</b>;
      },
    });
  }

  return (
    <Form className="w-full py-2 mb-1" onSubmit={handleSubmit(toastHandle)}>
      <div className="flex gap-3 items-start w-full">
        {/* User Image */}
        <Image
          className="bg-gray-200 dark:bg-slate-700 rounded-full object-cover shrink-0 mt-0.5 shadow-sm"
          alt={name}
          height={36}
          radius="full"
          src={photo}
          width={36}
        />

        {/* Input Field Container */}
        <div className="flex flex-col w-full relative group shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl">
          <Input
            {...register("content")}
            placeholder="Write a comment..."
            type="text"
            radius="full"
            variant="flat"
            className="flex-1 drop-shadow-sm"
            classNames={{
              inputWrapper:
                "bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all shadow-none py-5 border border-gray-200/50 dark:border-slate-700/50",
            }}
          />

          {/* Submit Button */}
          <div className="flex justify-end items-center absolute right-1.5 top-1.5 z-10">
            <Button
              type="submit"
              size="sm"
              className="font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/20 px-3 min-w-fit rounded-full text-[13px] transition-all hover:scale-105"
              isLoading={isPending}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
