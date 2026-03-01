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
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import { DocumentUpload } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CardsPosts from "../CardsPosts/CardsPosts";

export default function CreatePost() {
  const [uploadImageUser, setUploadImageUser] = useState(null);
  const [image, setImage] = useState(null);
  // const [idPostUser, setIdPostUser] = useState(null);
  const imageUpload = useRef();
  const { userData } = useContext(AuthUserContext) || {};
  const name = userData?.user?.name;
  const photo = userData?.user?.photo;
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      body: "",
    },
  });

  function handleImageUpload(e) {
    setImage(e.target.files[0]);
    setUploadImageUser(URL.createObjectURL(e.target.files[0]));
  }

  function sendPost(data) {
    const myFormData = new FormData();
    if (data.body.trim() !== "") {
      myFormData.append("body", data.body);
    }
    if (image) {
      myFormData.append("image", image);
    }
    return axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, myFormData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: sendPost,
    onSuccess: function ({ data }) {
      toast.success(data.message);
      reset();
      setUploadImageUser(null);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
    onError: function (err) {
      toast.error(err.message || "Failed to Create Post");
    },
  });
  return (
    <>
      <Card className="w-5/6 lg:w-2/4 mx-auto mt-5 bg-white">
        <CardHeader className="flex gap-3 ">
          <h2 className="font-semibold text-medium text-cyan-700">
            Hello {name}
            Create Post...
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Form className="w-full" onSubmit={handleSubmit(mutate)}>
            <div className="flex justify-between gap-1.5 items-center w-full">
              <Image
                className="bg-gray-400 rounded-full w-fit"
                alt={name}
                height={40}
                radius="sm"
                src={photo}
                width={40}
              />

              <Input
                {...register("body")}
                label="What in your mind"
                type="text"
                variant="bordered"
                className="w-full"
              />

              <DocumentUpload
                size="32"
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  imageUpload.current.click();
                }}
              />
            </div>
            <CardFooter className="flex justify-center items-center flex-col">
              <Button
                type="submit"
                color="primary"
                variant="ghost"
                className="w-full"
                isLoading={isPending}
              >
                Post
              </Button>
            </CardFooter>
          </Form>
          {uploadImageUser && (
            <img src={uploadImageUser} className="mt-3 w-full object-cover" />
          )}
        </CardBody>
        <Divider />

        <input
          type="file"
          className="hidden"
          onChange={handleImageUpload}
          ref={imageUpload}
        />
      </Card>
      {/* <CardsPosts className='hidden' idPostUser={idPostUser} /> */}
    </>
  );
}
