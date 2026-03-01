import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Form,
  Image,
  Input,
} from "@heroui/react";
import { Link } from "react-router";
import CommentsCard from "../CommentsCard/CommentsCard";
import imgUser from "../../../public/defUser.png";
import { CloseCircle, Menu, Messages1 } from "iconsax-reactjs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import CreateComment from "../CreateComment/CreateComment";
import { useContext, useState } from "react";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CardsPosts({ userPosts, id }) {
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      body: "",
    },
  });

  function sendUpdatePost({ data, postId }) {
    const myFormData = new FormData();
    if (data.body.trim() !== "") {
      myFormData.append("body", data.body);
    }
    return axios.put(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
      myFormData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: sendUpdatePost,
    onSuccess: function ({ data }) {
      toast.success(data.message);
      reset();
      setupdatePost(false);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
    onError: function (err) {
      toast.error(err.message || "Failed to update post");
      console.log("error", err);
    },
  });

  const [updatePost, setupdatePost] = useState(false);
  const { userData } = useContext(AuthUserContext) || {};
  const idUserPost = userData?.user?._id;

  const {
    body,
    user: { name, photo, _id: idUsersPosts },
    createdAt,
    commentsCount,
    image,
    _id,
    topComment,
  } = userPosts;

  function getAllComments() {
    return axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${_id}/comments?page=1&limit=${commentsCount}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allComments", _id],
    queryFn: getAllComments,
    enabled: !!id,
    select: (data) => data.data.data.comments,
  });

  if (id && isLoading) {
    return (
      <div className="w-5/6 lg:w-2/4 mx-auto mt-5 space-y-9">
        <Skeleton count={5} baseColor="#e0e0e0" className="h-20 rounded-3xl" />
      </div>
    );
  }

  if (isError && id) {
    return <h1 className="text-center text-2xl mt-5">{error.message}</h1>;
  }
  function deleteUserPost(postId) {
    const promise = axios.delete(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );

    toast.promise(promise, {
      loading: "Deleting post...",
      success: (data) => {
        queryClient.invalidateQueries({ queryKey: ["allPosts"] });
        return data.data.message;
      },
      error: (err) => {
        console.log(err);
        return err.response?.data?.message || "Failed to delete post";
      },
    });
  }

  return (
    <>
      <Card className="w-5/6 lg:w-2/4 mx-auto mt-5 bg-white">
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-3">
            <Image
              className="bg-gray-400 rounded-full object-cover"
              alt={name}
              height={40}
              radius="sm"
              src={photo ? photo : imgUser}
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md font-semibold">{name}</p>
              <p className="text-small text-default-500">
                {new Date(createdAt).toLocaleDateString("en-CA")}
              </p>
            </div>
          </div>

          {idUserPost === idUsersPosts && (
            <Dropdown>
              <DropdownTrigger>
                <span className=" border border-black rounded-2xl p-1">
                  <Menu size="20" color="#000000" className="cursor-pointer" />
                </span>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu with shortcut"
                variant="flat"
              >
                <DropdownItem
                  key="update"
                  color="warning"
                  onClick={() => {
                    setupdatePost(true);
                    reset({ body: body });
                  }}
                >
                  Update Post
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  key="delete"
                  onClick={() => deleteUserPost(_id)}
                >
                  Delete Post
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </CardHeader>
        <Divider />

        <CardBody className="flex flex-col items-center">
          {updatePost ? (
            <Form
              className="w-full flex flex-col gap-1"
              onSubmit={handleSubmit((data) => mutate({ data, postId: _id }))}
            >
              <div className="flex items-center gap-1 w-full">
                <Input
                  {...register("body")}
                  size="lg"
                  variant="bordered"
                  defaultValue={body}
                  type="text"
                  className="w-full"
                />
                <CloseCircle
                  size="32"
                  className="cursor-pointer"
                  color="#8E0808"
                  onClick={() => setupdatePost(false)}
                />
              </div>
              <Button
                color="warning"
                variant="shadow"
                type="submit"
                className="w-1/4 self-center"
                isLoading={isPending}
              >
                Update Your Post
              </Button>
            </Form>
          ) : (
            <p className="text-center font-semibold capitalize">
              {body ? body : " "}
            </p>
          )}
          {image && (
            <Image alt={body} src={image} className="mt-3 object-cover" />
          )}
        </CardBody>

        <Divider />

        {topComment ? (
          <div>
            <div className="flex justify-between items-center">
              <CardBody className="w-fit">
                <h5 className="mb-1.5 font-semibold text-lg flex gap-1.5">
                  <span>
                    <Messages1 size="32" color="#2ccce4" />
                  </span>
                  {commentsCount}
                </h5>
              </CardBody>
              {!id && (
                <CardFooter className="flex items-center justify-end w-fit">
                  <Link
                    className="underline text-cyan-500"
                    to={`/postDetails/${_id}`}
                  >
                    See all comments
                  </Link>
                </CardFooter>
              )}
            </div>

            {id && data ? (
              data.map((e) => <CommentsCard key={e._id} detComment={e} />)
            ) : (
              <CommentsCard detComment={topComment} />
            )}
          </div>
        ) : (
          <h5 className="text-center font-bold text-lg mt-3">
            No comments here
          </h5>
        )}
        <div className="m-5">
          <CreateComment id={_id} />
        </div>
      </Card>
    </>
  );
}
