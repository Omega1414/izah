import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, increment, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { Blog } from "../../../Context/Context";
import FollowBtn from "../../Home/UserToFollow/FollowBtn";
import "./post.css"
import moment from "moment/moment";
import Actions from "../Posts/Actions/Actions";
import Like from "./Actions/Like";
import Comment from "./Actions/Comment";
import SharePost from "./Actions/SharePost";
import SavedPost from "../Posts/Actions/SavedPost";
import Recommended from "./Recommended";
import Comments from "../Comments/Comments";
import { GrView } from "react-icons/gr";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageViews, setPageViews] = useState(0); // State to store page views count
  const { currentUser } = Blog();
  const isInitialRender = useRef(true);

  // Increment page views if the user hasn't viewed it before
  useEffect(() => {
    if (isInitialRender?.current && currentUser?.uid) {
      const incrementPageView = async () => {
        try {
          const postRef = doc(db, "posts", postId);
          const postSnapshot = await getDoc(postRef);

          if (postSnapshot.exists()) {
            const postData = postSnapshot.data();

            // Check if the user has already viewed the post
            if (!postData.viewedBy?.includes(currentUser.uid)) {
              // Increment page views and add user to the viewedBy array
              await updateDoc(postRef, {
                pageViews: increment(1),
                viewedBy: arrayUnion(currentUser.uid), // Add current user ID to viewedBy array
              });
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
      };
      incrementPageView();
    }
    isInitialRender.current = false;
  }, [postId, currentUser]);

  // Fetch post and page views data
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
              setPageViews(postData.pageViews || 0); // Set page views from the post data
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
  }, [postId]);

  const { title, desc, postImg, username, created, userImg, userId } = post;

  const navigate = useNavigate();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <section className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
            <h2 className="text-2xl lg:text-2xl font-bold capitalize font-sans text-center dark:text-darkText">{title}</h2>
            <div className="flex items-center gap-2 py-[2rem] ">
              <img
                onClick={() => navigate(`/profile/${userId}`)}
                className="w-[3rem] h-[3rem] object-cover rounded-full cursor-pointer"
                src={userImg}
                alt="user-img"
              />
              <div>
                <div className="capitalize">
                <span
          onClick={() => navigate(`/profile/${userId}`)} // Add onClick here to navigate to the profile page
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
                <p className="text-sm text-gray-500 dark:text-blue-300">
                 
                  <span className="ml-1">{moment(created).fromNow()}</span>
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
                  className="w-full max-h-[300px] object-cover lg:object-contain "
                  src={postImg}
                  alt="post-img"
                />
              )}
              <div
  className="mt-6 dark:text-gray-300 text-[18px]"
  dangerouslySetInnerHTML={{
    __html: (desc || '').replace(/<img/g, '<img class="center-img max-h-[400px]" style="display: block; margin: 0 auto;"')  // Safeguard against undefined
  }}
/>
            </div>
          </section>
          {post && <Recommended post={post} />}
          <Comments postId={postId} />
        </>
      )}
    </>
  );
};

export default SinglePost;
