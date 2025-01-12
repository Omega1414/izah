import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { readTime } from "../.././../utils/helper";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { MdOutlineAccessTime } from "react-icons/md";
import { Blog } from "../../../Context/Context";
import SavedPost from "./Actions/SavedPost";
import Actions from "./Actions/Actions";

const Recommended = ({ post: singlePost }) => {
  const { data } = useFetch("posts");
  const [commonTags, setCommonTags] = useState([]);

  useEffect(() => {
    let recommendedPost = [];
    data &&
      data.forEach((post) => {
        if (post.id === singlePost.id) {
          return;
        }

        const postTag = post.tags;
        const commonTags = postTag.filter((tag) =>
          singlePost?.tags?.includes(tag)
        );

        if (commonTags.length > 0) {
          recommendedPost.push({
            ...post,
            commonTags,
          });
        }
      });
    recommendedPost.sort(() => Math.round() * -0.5);
    const minRecommendation = 4;
    const slicePost = recommendedPost.slice(0, minRecommendation);
    setCommonTags(slicePost);
  }, [data, singlePost]);

  return (
    <section className="bg-gray-100 dark:bg-darkBg border-t-2 border-gray-200 dark:border-gray-600">
      <div className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem] dark:text-darkText">
        <h2 className="text-xl font-bold">Tövsiyə olunan paylaşımlar</h2>
        {commonTags.length === 0 ? (
          <p>Bu paylaşıma uyğun heç bir tövsiyə tapılmadı</p>
        ) : (
          <div className="grid grid-cols-card gap-[2rem] my-[3rem]">
            {commonTags.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommended;

const Post = ({ post }) => {

  const { data } = useFetch("users");
  const { title, desc, created, postImg, id: postId, userId, pageViews, username, userImg } = post; // Use userImg here
  const { currentUser } = Blog();
  const [maxDescLength, setMaxDescLength] = useState(450);


  // Function to remove <img> tags from the description
  const removeImagesFromDescription = (text) => {
    return text.replace(/<img[^>]*>/g, ""); // Remove any <img> tags from the description
  };
  const navigate = useNavigate(null);

  return (
    <section className="bg-white hover:bg-gray-200 shadow-lg rounded-md p-4 flex overflow-visible flex-col items-center 
    justify-center dark:bg-gray-700 hover:dark:bg-gray-800  max-w-[600px] w-full max-h-[350px] md:max-h-[250px]">
      <div
        onClick={() => navigate(`/post/${postId}`)}
        className="flex flex-col sm:flex-row gap-4 cursor-pointer w-full h-full"
      >
        {/* Content section for title and description */}
        <div className="flex flex-col gap-2 w-full overflow-hidden">
          {/* Profile image and username */}
          <div className="flex items-center gap-2">
            {userImg && (
              <img
                src={userImg}
                alt="user profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <p className="font-semibold capitalize xl:text-sm  dark:text-blue-200">{username}</p>
          </div>
          <h2 className="text-lg font-bold font-sans line-clamp-2 leading-6 capitalize xl:text-md dark:text-white overflow-hidden mt-1">{title}</h2>

          {/* Description with line clamp and ellipsis */}
          <div
            className="py-1 text-gray-500 leading-5 text-sm lg:text-md xl:text-sm dark:text-darkText"
            dangerouslySetInnerHTML={{
              __html: removeImagesFromDescription(desc.length > maxDescLength ? desc.substring(0, maxDescLength) + "..." : desc), // Remove images from description
            }}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2, // Dynamically set the line clamp
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          />
        </div>

        {/* Image container - only render it if there's an image */}
        {postImg && (
          <div className="w-full sm:w-[280px] h-[100px] md:h-[160px] flex items-center justify-center overflow-hidden">
            <img
              src={postImg}
              alt="postImg"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        )}
      </div>

      {/* Post Footer (Read time, Date, Page Views, etc.) */}
      <div className="flex items-center justify-between w-full mt-2 md:mt-1">
        <span className="text-xs text-gray-600 flex items-center dark:text-gray-100 text-[14px]">
          <GrView /> <p className="ml-[4px]">{pageViews}</p><p className="ml-1">|</p> 
          <MdOutlineAccessTime className="ml-1" /><p className="ml-1 capitalize">{moment(created).format("MMM DD, YYYY HH:mm")}</p>
        </span>
        <div className="flex items-end justify-end gap-3 dark:text-white">
          <SavedPost post={post} />
          {currentUser?.uid === userId && <Actions postId={postId} title={title} desc={desc} />}
        </div>
      </div>
    </section>
  );
};