import { Button, Form, Image, Input } from "@heroui/react";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateComment({ id }) {
  const { userData } = useContext(AuthUserContext) || {};
  const { name, photo } = userData?.user || {};

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });
  //   function handleImageUpload(e) {
  //     setImage(e.target.files[0]);
  //     setUploadImageUser(URL.createObjectURL(e.target.files[0]));
  //   }

  function sendUserComment(data) {
    const myFormData = new FormData();
    if (data.content.trim() !== "") {
      myFormData.append("content", data.content);
    }
    // if (image) {
    //   myFormData.append("image", image);
    // }
    return axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts/${id}/comments`,
      myFormData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending } = useMutation({
    mutationFn: sendUserComment,
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  function toastHandle(data) {
    toast.promise(mutateAsync(data), {
      loading: <b>Creating Comment...</b>,
      success: function (data) {
        reset();
        return <b>{data.data.message}</b>;
      },
      error: function (err) {
        return <b>{err.message || "Failed to Create Comment"}</b>;
        console.log(err);
      },
    });
  }
  return (
    <>
      <Form
        className="bg-gray-500/40  p-2 rounded-xl"
        onSubmit={handleSubmit(toastHandle)}
      >
        <div className="flex gap-3 mt-3 items-center w-full">
          <Image
            className="bg-white border border-black rounded-full object-cover"
            alt={name}
            height={35}
            radius="sm"
            src={photo}
            width={40}
          />
          <Input
            {...register("content")}
            label="Create Your Comment"
            type="text"
            variant="bordered"
            className="w-full bg-white rounded-2xl"
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          className="w-full"
          isLoading={isPending}
        >
          Post
        </Button>
      </Form>
    </>
  );
}
