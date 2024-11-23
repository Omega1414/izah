import React, { useState, useEffect } from "react";
import { readTime } from "../../../utils/helper";
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

  useEffect(() => {
    const updateResponsiveValues = () => {
      const screenWidth = window.innerWidth;

      // Adjust the number of lines based on the screen width
      if (screenWidth < 640) {  // For small screens
        setLineClamp(3);
        setMaxDescLength(300);  // Shorten description for small screens
      } else if (screenWidth < 1024) {  // For medium screens
        setLineClamp(3);
        setMaxDescLength(400);  // Slightly longer description
      } else if (screenWidth < 1524) {  // For medium screens
        setLineClamp(4);
        setMaxDescLength(500);  // Slightly longer description
      }
       else {  // For larger screens
        setLineClamp(5);
        setMaxDescLength(1500);  // Longer description for larger screens
      }
    };

    updateResponsiveValues();  // Set initial values
    window.addEventListener("resize", updateResponsiveValues);  // Update values on resize

    return () => {
      window.removeEventListener("resize", updateResponsiveValues);  // Clean up event listener
    };
  }, []);

  return (
    <section className="bg-white shadow-lg rounded-md p-4 max-w-[850px] dark:bg-gray-400">
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
              WebkitLineClamp: lineClamp, // Dynamically set the line clamp
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
              className="w-[350px] h-[250px] object-contain rounded-md"
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
