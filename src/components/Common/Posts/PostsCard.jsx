import React from "react";
import { readTime } from "../../../utils/helper";
import moment from "moment/moment";
import SavedPost from "./Actions/SavedPost";
import { Blog } from "../../../Context/Context";
import Actions from "./Actions/Actions";
import { useNavigate } from "react-router-dom";

const PostsCard = ({ post }) => {
  const { title, desc, created, postImg, id: postId, userId, username } = post;
  const { currentUser } = Blog();
  const navigate = useNavigate();

  return (
    <section className="bg-white shadow-lg rounded-md p-4">
      <div
        onClick={() => navigate(`/post/${postId}`)}
        className="flex flex-col sm:flex-row gap-4 cursor-pointer"
      >
        {/* Content section for title and description */}
        <div className="flex-1 flex flex-col justify-between">
          <p className="pb-2 font-semibold capitalize">{username}</p>
          <h2 className="text-xl font-bold line-clamp-2 leading-6 capitalize">{title}</h2>

          {/* Description with line clamp and ellipsis */}
          <div
            className="py-1 text-gray-500 leading-5"
            dangerouslySetInnerHTML={{
              __html: desc.length > 250 ? desc.substring(0, 250) + "..." : desc, // Truncate and add "..."
            }}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: "4", // Limit description to 4 lines
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          />

          {/* Action buttons at the bottom-right of the content area */}
          <div className="mt-auto flex items-center justify-end gap-3">
            <SavedPost post={post} />
            {currentUser?.uid === userId && <Actions postId={postId} title={title} desc={desc} />}
          </div>
        </div>

        {/* Image container */}
        <div className="flex-[1]">
          {postImg && (
            <img
              src={postImg}
              alt="postImg"
              className="w-full h-[8rem] object-cover rounded-md"
            />
          )}
        </div>
      </div>

      {/* Post Footer (Read time, Date, etc.) */}
      <div className="flex items-center justify-between w-full md:w-[70%] mt-[2rem] md:mt-0">
        <p className="text-xs text-gray-600">
          {readTime({ __html: desc })} min read . {moment(created).format("MMM DD")}
        </p>
      </div>
    </section>
  );
};

export default PostsCard;
