import { Button } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserPlus, UserMinus } from "lucide-react";
import toast from "react-hot-toast";

export default function BtnFollowAndUnfollow({ isFollowing, id }) {
  const queryClient = useQueryClient();

  // Mutation handle follow/unfollow logic
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${id}/follow`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        },
      ),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Done!");
      queryClient.invalidateQueries({ queryKey: ["singleProfile", id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <Button
      onPress={() => mutate()}
      isLoading={isPending}
      color={isFollowing ? "default" : "primary"}
      variant={isFollowing ? "bordered" : "solid"}
      radius="full"
      size="md"
      className={`px-5 h-10 min-w-30 font-semibold text-sm tracking-wide transition-all duration-300 shadow-sm ${
        isFollowing
          ? "border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-300"
          : "bg-[#1877f2] hover:bg-[#1466d8]"
      }`}
      startContent={
        !isPending &&
        (isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />)
      }
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
