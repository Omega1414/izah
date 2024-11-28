import React, { useEffect } from 'react'
import useSingleFetch from '../../../hooks/useSingleFetch'
import { Blog } from '../../../../Context/Context'
import Loading from '../../../Loading/Loading'
import PostsCard from '../../../Common/Posts/PostsCard'
import { BiLock } from 'react-icons/bi'

const ProfileLists = ({ getUserData }) => {
  const { currentUser } = Blog();
  const { data, loading } = useSingleFetch("users", currentUser?.uid, "savePost");

  // Check if the user has allowed others to see saved posts
  const canSeeSavedPosts = getUserData?.allowSavedPosts;

  return (
    <div>
      {currentUser && currentUser?.uid === getUserData?.userId ? (
        <div className='flex flex-col gap-[2rem] mb-[2rem]'>
          {canSeeSavedPosts ? (
            <>
              {data.length === 0 ? (
                <p className='text-gray-500'>
                  <span className='capitalize mr-1'>{getUserData?.username} has no saved posts</span>
                </p>
              ) : loading ? (
                <Loading />
              ) : (
                data?.map((post, i) => <PostsCard post={post} key={i} />)
              )}
            </>
          ) : (
            <PrivateLists username={getUserData?.username} />
          )}
        </div>
      ) : (
        <PrivateLists username={getUserData?.username} />
      )}
    </div>
  );
};

const PrivateLists = ({ username }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-[3rem] text-center'>
      <p>
        <span className='capitalize'>{username} saved posts are private</span>
      </p>
      <span className='text-[10rem] text-gray-500'>
        <BiLock />
      </span>
    </div>
  );
};

export default ProfileLists;