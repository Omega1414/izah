import React, { useState } from "react";
import { Blog } from "../../../Context/Context";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";

const Follow = () => {
  const { currentUser, allUsers } = Blog();
  const [count, setCount] = useState(5);
  const users =
    allUsers &&
    allUsers
      ?.slice(0, count)
      .filter((user) => user.userId !== currentUser?.uid);

  const navigate = useNavigate();
  return (
    <>
      {allUsers &&
        users?.map((user, i) => {
          const { username, bio, userImg, userId } = user;
         
          return (
            <div key={i} className="flex items-center gap-2 my-4 ">
              <div
                onClick={() => navigate("/profile" + "/" + userId)}
                className="flex-1 flex items-center gap-2 cursor-pointer">
                <img
                  className="w-[3rem] h-[3rem] object-cover gap-2 cursor-pointer rounded-full"
                  src={userImg || "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc="}
                  alt="userImg"
                />
                <div className="flex flex-col">
                  <h2 className="font-bold capitalize dark:text-blue-300">{username}</h2>
                  <span className="leading-4 text-gray-500 text-sm line-clamp-2 dark:text-blue-100">
                    {bio?.length > 23 ? bio.slice(0, 23) + "..." : bio || ""}
                  </span>
                </div>
              </div>
            
              <FollowBtn userId={userId} />
             
            </div>
          );
        })}
      {allUsers?.length > 5 && (
        <button
          onClick={() =>
            setCount((prev) => users.length < allUsers?.length && prev + 3)
          }
          className="mb-3 text-green-900 text-sm hover:underline dark:text-blue-200">
          Daha çox göstər
        </button>
      )}
    </>
  );
};

export default Follow;
