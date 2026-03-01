import axios from "axios";
import { Link, useParams } from "react-router";
import CardsPosts from "../../Components/CardsPosts/CardsPosts";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "iconsax-reactjs";

export default function AllComments() {
  const { id } = useParams();

  function getSinglePostDetails() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singlePost", id],
    queryFn: getSinglePostDetails,
    select: (data) => data.data.data.post,
  });

  if (isLoading) {
    return (
      <div className="w-5/6 lg:w-2/4  mx-auto mt-5 space-y-9">
        <Skeleton count={40} baseColor="#e0e0e0" className="h-30 rounded-3xl" />
      </div>
    );
  }
  if (isError) {
    return <h1 className="text-center text-2xl mt-5">{error.message}</h1>;
  }
  return (
    <>
      <title>All Comments Page</title>
      <div className="min-h-screen my-3">
        <Link className="ms-7 flex items-center  gap-1" to="/posts">
          <ArrowLeft size="44" color="#2ccce4" />
          <span className="font-semibold">Back to posts</span>
        </Link>
        <CardsPosts id userPosts={data} />
      </div>
    </>
  );
}
