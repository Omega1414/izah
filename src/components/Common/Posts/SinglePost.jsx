import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";  // Import Helmet
import Loading from "../../Loading/Loading";
import { Blog } from "../../../Context/Context";
import FollowBtn from "../../Home/UserToFollow/FollowBtn";
import "./post.css"
import moment from "moment";
import Actions from "../Posts/Actions/Actions";
import Like from "./Actions/Like";
import Comment from "./Actions/Comment";
import SharePost from "./Actions/SharePost";
import SavedPost from "../Posts/Actions/SavedPost";
import Recommended from "./Recommended";
import Comments from "../Comments/Comments";
import { GrView } from "react-icons/gr";
import { MdOutlineAccessTime } from "react-icons/md";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageViews, setPageViews] = useState(0);
  const { currentUser } = Blog();
  const isInitialRender = useRef(true);

  const incrementPageView = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        
        if (!localStorage.getItem(`viewedPost_${postId}`)) {
          localStorage.setItem(`viewedPost_${postId}`, "true");

          await updateDoc(postRef, {
            pageViews: increment(1),
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", postId);
        const getPost = await getDoc(postRef);

        if (getPost.exists()) {
          const postData = getPost.data();
          if (postData?.userId) {
            const userRef = doc(db, "users", postData?.userId);
            const getUser = await getDoc(userRef);

            if (getUser.exists()) {
              const { created, ...rest } = getUser.data();
              setPost({ ...postData, ...rest, id: postId });
              setPageViews(postData.pageViews || 0);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPost();
    incrementPageView();
  }, [postId]);

  const { title, desc, postImg, username, created, userImg, userId } = post;
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{title}</title>  {/* Set the dynamic title */}
        <meta name="description" content={desc} />  {/* Set the dynamic description */}
      </Helmet>
      
      {loading ? (
        <Loading />
      ) : (
        <>
          <section className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
            <h2 className="text-2xl lg:text-2xl font-bold capitalize font-sans text-center dark:text-darkText">{title}</h2>
            <div className="flex items-center gap-2 py-[2rem]">
              <img
                onClick={() => navigate(`/profile/${userId}`)}
                className="w-[3rem] h-[3rem] object-cover rounded-full cursor-pointer"
                src={userImg}
                alt="user-img"
              />
              <div>
                <div className="capitalize">
                  <span
                    onClick={() => navigate(`/profile/${userId}`)} 
                    className="dark:text-blue-300 font-bold cursor-pointer"
                  >
                    {username}
                  </span>
                  <span className="ml-2">
                    {currentUser && currentUser?.uid !== userId && (
                      <FollowBtn userId={userId} />
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-blue-300 flex items-center">
                  <MdOutlineAccessTime className="ml-0.5" /> <span className="ml-1">{moment(created).fromNow()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-t border-gray-400 py-[0.5rem]">
              <div className="flex items-center gap-5">
                <Like postId={postId} />
                <Comment />
                <span className="text-gray-500 dark:text-blue-300 flex items-center">
                  <GrView className="mr-1"/> {pageViews}
                </span>
              </div>
              <div className="flex items-center pt-2 gap-5 dark:text-blue-200">
                {post && <SavedPost post={post} />}
                <SharePost />
                {currentUser && currentUser?.uid === post?.userId && (
                  <Actions postId={postId} title={title} desc={desc} />
                )}
              </div>
            </div>
            <div className="mt-[3rem]">
              {postImg && (
                <img
                  className="w-full max-h-[300px] object-cover lg:object-contain"
                  src={postImg}
                  alt="post-img"
                />
              )}
              <div
                className="mt-6 dark:text-gray-300 text-[18px]"
                dangerouslySetInnerHTML={{
                  __html: (desc || '').replace(/<img/g, '<img class="center-img max-h-[400px]" style="display: block; margin: 0 auto;"')
                }}
              />
            </div>
          </section>
          <div className="flex mt-8 items-center justify-center mx-auto border-t-2 border-gray-400 dark:border-gray-600">
            <Comments postId={postId} />
          </div>
          {post && <Recommended post={post} />}
        </>
      )}
    </>
  );
};

export default SinglePost;
