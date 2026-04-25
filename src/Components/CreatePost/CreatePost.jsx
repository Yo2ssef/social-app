import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Form,
  Image,
  Input,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentUpload } from "iconsax-reactjs";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";

export default function CreatePost() {
  // Hooks & Local States
  const [uploadImageUser, setUploadImageUser] = useState(null);
  const [image, setImage] = useState(null);
  const imageUpload = useRef();
  const queryClient = useQueryClient();

  // Context Data
  const { userData } = useContext(AuthUserContext) || {};
  const name = userData?.user?.name;
  const photo = userData?.user?.photo;

  // Form Configuration
  const { handleSubmit, register, reset } = useForm({
    defaultValues: { body: "" },
  });

  // Handle Image Selection Preview
  function handleImageUpload(e) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setUploadImageUser(URL.createObjectURL(e.target.files[0]));
    }
  }

  // API Post Function
  function sendPost(data) {
    const myFormData = new FormData();
    if (data.body.trim() !== "") {
      myFormData.append("body", data.body);
    }
    if (image) {
      myFormData.append("image", image);
    }

    return axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, myFormData, {
      headers: { token: localStorage.getItem("token") },
    });
  }

  // Mutation Logic
  const { mutate, isPending } = useMutation({
    mutationFn: sendPost,
    onSuccess: ({ data }) => {
      toast.success(data?.message);
      reset();
      setUploadImageUser(null);
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to Create Post");
    },
  });

  return (
    <>
      <Card className="w-[95%] lg:w-170 mx-auto mt-8 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg border border-white/60 dark:border-slate-700/60 rounded-3xl overflow-visible">
        {/* Card Title */}
        <CardHeader className="flex gap-3 px-6 pt-6 pb-2">
          <h2 className="font-bold text-gray-800 dark:text-slate-200 text-xl tracking-tight">
            Create Post
          </h2>
        </CardHeader>

        <Divider className="my-2 opacity-50" />

        <CardBody className="pt-2 px-6">
          <Form className="w-full" onSubmit={handleSubmit(mutate)}>
            <div className="flex gap-4 items-center w-full">
              {/* User Avatar */}
              <Image
                className="bg-gray-200 dark:bg-slate-700 rounded-full object-cover shrink-0 shadow-sm"
                alt={name}
                height={48}
                radius="full"
                src={photo}
                width={48}
              />

              {/* Text Input Field */}
              <Input
                {...register("body")}
                placeholder={`What's on your mind, ${name ? name.split(" ")[0] : "User"}?`}
                type="text"
                radius="full"
                variant="flat"
                size="lg"
                className="flex-1"
                classNames={{
                  inputWrapper: "bg-gray-100/50 dark:bg-slate-800/50 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all shadow-inner",
                }}
              />

              {/* Image Upload Icon */}
              <DocumentUpload
                size="32"
                variant="Bulk"
                className="text-blue-500 cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all shrink-0"
                onClick={() => imageUpload.current.click()}
              />
            </div>

            {/* Post Button */}
            <CardFooter className="px-0 pt-5 pb-2 w-full">
              <Button
                type="submit"
                className="w-full font-bold bg-[#1877f2] hover:bg-[#166fe5] shadow shadow-blue-500/30 text-white rounded-xl text-md"
                isLoading={isPending}
              >
                Post
              </Button>
            </CardFooter>
          </Form>

          {/* Selected Image Preview Area */}
          {uploadImageUser && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
              <img
                src={uploadImageUser}
                alt="preview"
                className="w-full object-cover max-h-96"
              />
            </div>
          )}
        </CardBody>

        {/* Hidden Input for Files */}
        <input
          type="file"
          className="hidden"
          onChange={handleImageUpload}
          ref={imageUpload}
          accept="image/*"
        />
      </Card>
    </>
  );
}