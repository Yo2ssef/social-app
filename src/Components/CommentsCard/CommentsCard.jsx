import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";
import imgUser from "../../../public/defUser.png";
import { useState } from "react";

export default function CommentsCard({ detComment }) {
  const {
    content,
    commentCreator: { name, photo, username },
    createdAt,
  } = detComment;
  // const [image, setimage] = useState(null);

  return (
    <>
      <Card className="pb-3 bg-black/70 m-5 text-white">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
              // onError={(e) => {
              //   if (e.target.src.includes("undfinded"))
              //     setimage((e.target.src = { imgUser }));
              // }}
              src={photo}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none">{name}</h4>
              <h5 className="text-small tracking-tight">
                {new Date(createdAt).toLocaleDateString("en-CA")}
              </h5>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small">
          <p className=" text-center">{content}</p>
        </CardBody>
      </Card>
    </>
  );
}
