import { useContext, useRef } from "react";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import { Button, Card, CardBody, CardHeader, Image } from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfileUser() {
  const { userData, getUserData } = useContext(AuthUserContext) || {};
  const {
    name,
    email,
    username,
    photo,
    dateOfBirth,
    gender,
    followersCount,
    followingCount,
    bookmarksCount,
  } = userData?.user || {};

  const photoUpload = useRef();

  async function handlePhotoUpload() {
    const myFormPhoto = new FormData();
    myFormPhoto.append("photo", photoUpload.current.files[0]);
    toast.promise(
      axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/upload-photo`,
        myFormPhoto,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      ),
      {
        loading: "Uploading Your Profile Picture",
        success: function ({ data }) {
          getUserData();
          return data.message;
        },
        error: function (err) {
          return console.log(err) || "Failed to Upload Profile Picture";
        },
      },
    );
  }
  return (
    <>
      <Card className="py-4 w-1/2 mx-auto mt-5">
        <CardHeader className=" pb-0 pt-2 px-4 flex-col items-center">
          <p>
            <span className="text-2xl font-bold">Name: </span>
            <span className="text-gray-600 font-semibold">{name}</span>
          </p>
          <p>
            <span className="text-2xl font-bold">Username: </span>
            <span className="text-gray-600 font-semibold">@{username}</span>
          </p>
          <p>
            <span className="text-2xl font-bold">Date of Birth: </span>
            <span className="text-gray-600 font-semibold">
              {new Date(dateOfBirth).toLocaleDateString("en-CA")}
            </span>
          </p>
          <p>
            <span className="text-2xl font-bold">Gender: </span>
            <span className="text-gray-600 font-semibold">{gender}</span>
          </p>
          <p>
            <span className="text-2xl font-bold">Email: </span>
            <span className="text-gray-600 font-semibold">{email}</span>
          </p>
          <div className="m-auto grid grid-cols-12 gap-4">
            <div className="text-center col-span-4 rounded-2xl border border-black/30 bg-gray-100 p-4 mt-4">
              <span className="text-2xl font-bold">Followers</span>
              <p className="text-gray-600">{followersCount}</p>
            </div>
            <div className="text-center col-span-4 rounded-2xl border border-black/30 bg-gray-100 p-4 mt-4">
              <span className="text-2xl font-bold">Following</span>
              <p className="text-gray-600">{followingCount}</p>
            </div>
            <div className="text-center col-span-4 rounded-2xl border border-black/30 bg-gray-100 p-4 mt-4">
              <span className="text-2xl font-bold">Bookmarks</span>
              <p className="text-gray-600">{bookmarksCount}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible py-2  flex justify-center items-center mt-1.5">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={photo}
            width={270}
          />

          <Button
            color="primary"
            className=" cursor-pointer mt-3"
            variant="ghost"
            onClick={() => {
              photoUpload.current.click();
            }}
          >
            Change Profile Picture
          </Button>
        </CardBody>
        <input
          type="file"
          className="hidden"
          onChange={handlePhotoUpload}
          ref={photoUpload}
        />
      </Card>
    </>
  );
}
