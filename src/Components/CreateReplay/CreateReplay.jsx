import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input, Avatar, Button, Form } from "@heroui/react";
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import { SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateReplay({ idPost, idComment }) {
  // Hooks & Context
  const queryClient = useQueryClient();
  const { userData } = useContext(AuthUserContext) || {};
  const userPhoto = userData?.user?.photo;
  const userName = userData?.user?.name;

  // Form Management
  const { handleSubmit, register, reset } = useForm({
    defaultValues: { content: "" },
  });

  // API: Send Reply logic
  function hanldeReplay(data) {
    const myFormData = new FormData();
    if (data.content.trim() !== "") {
      myFormData.append("content", data.content);
    }
    return axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts/${idPost}/comments/${idComment}/replies`,
      myFormData,
      { headers: { token: localStorage.getItem("token") } },
    );
  }

  // Mutation logic
  const { mutate, isPending } = useMutation({
    mutationFn: hanldeReplay,
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["replies", idComment] });
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add reply");
    },
  });

  return (
    <Form
      onSubmit={handleSubmit(mutate)}
      className="flex flex-col gap-2 mt-1 w-full relative"
    >
      {/* User Info Header */}
      <div className="flex items-center gap-2">
        <Avatar
          radius="full"
          src={userPhoto}
          className="w-6 h-6 shrink-0 shadow-sm self-start mt-0.5"
        />
        <h1 className="text-[13px] font-semibold">{userName}</h1>
      </div>

      {/* Input and Submit Section */}
      <div className="flex w-full items-center gap-1.5 relative">
        <Input
          {...register("content", { required: true })}
          placeholder="Reply to comment..."
          type="text"
          radius="full"
          variant="flat"
          size="sm"
          className="flex-1"
          classNames={{
            inputWrapper:
              "bg-gray-100/60 dark:bg-slate-800/60 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-sm transition-all shadow-none h-8 min-h-[32px] px-3",
            input: "text-[12px]",
          }}
        />
        <Button
          isIconOnly
          type="submit"
          size="sm"
          radius="full"
          color="primary"
          className="h-8 w-8 min-w-8 bg-[#1877f2] shrink-0"
          isLoading={isPending}
        >
          {!isPending && (
            <SendHorizontal size={14} className="text-white ml-0.5" />
          )}
        </Button>
      </div>
    </Form>
  );
}
