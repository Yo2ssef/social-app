import axios from "axios";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";
import CreatePost from "../../Components/CreatePost/CreatePost";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Posts() {
  function getAllPosts() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
    select: (data) => data.data.data.posts,
  });

  if (isLoading) {
    return (
      <div className="w-5/6 lg:w-2/4  mx-auto mt-5 space-y-9">
        <Skeleton count={40} baseColor="#e0e0e0" className="h-40 rounded-3xl" />
      </div>
    );
  }
  if (isError) {
    return <h1 className="text-center text-2xl mt-5">{error.message}</h1>;
  }

  return (
    <>
      <title>Post Page</title>
      <CreatePost />
      {data.map((e) => (
        <CardsPosts key={e._id} userPosts={e} />
      ))}
    </>
  );
}
