import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import SavedPost from "./Actions/SavedPost";
import { Blog } from "../../../Context/Context";
import Actions from "./Actions/Actions";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";

const PostsCard = ({ post }) => {
  const { title, desc, created, postImg, id: postId, userId, username, pageViews } = post; // Make sure pageViews is included
  const { currentUser } = Blog();
  const navigate = useNavigate();

  const [lineClamp, setLineClamp] = useState(4); // Default line clamp
  const [maxDescLength, setMaxDescLength] = useState(450); // Default max description length

  

  return (
    <section className="bg-white shadow-lg rounded-md p-4 w-full dark:bg-gray-400">
      <div
        onClick={() => navigate(`/post/${postId}`)}
        className="flex flex-col sm:flex-row gap-4 cursor-pointer max-w-[1000px]"
      >
        {/* Content section for title and description */}
        <div className="flex flex-col gap-2 w-full"> {/* Adjusted the gap to a smaller value */}
          <p className="font-semibold capitalize xl:text-xl dark:text-blue-200">{username}</p>
          <h2 className="text-l font-bold line-clamp-2 leading-6 capitalize xl:text-xl dark:text-white">{title}</h2>

          {/* Description with line clamp and ellipsis */}
          <div
            className="py-1 text-gray-500 leading-5 text-sm lg:text-lg xl:text-lg dark:text-gray-200"
            dangerouslySetInnerHTML={{
              __html: desc.length > maxDescLength ? desc.substring(0, maxDescLength) + "..." : desc, // Truncate and add "..."
            }}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2, // Dynamically set the line clamp
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          />
        </div>

        {/* Image container */}
        <div className="w-full">
          {postImg && (
            <img
              src={postImg}
              alt="postImg"
              className="w-[180px] h-[180px] object-contain rounded-md"
            />
          )}
        </div>
      </div>

      {/* Post Footer (Read time, Date, Page Views, etc.) */}
      <div className="flex items-center justify-between w-full mt-2 md:mt-1"> {/* Adjusted margin */}
        <span className="text-xs text-gray-600 flex items-center dark:text-yellow-100 text-[14px]">
          <GrView /> <p className="ml-[4px]">{pageViews}</p> <p className="ml-2">{moment(created).format("MMM DD")}</p>
    
        </span>
        <div className="flex items-end justify-end gap-3">
          <SavedPost post={post} />
          {currentUser?.uid === userId && <Actions postId={postId} title={title} desc={desc} />}
        </div>
      </div>
    </section>
  );
};

export default PostsCard;
