import React, { useState } from 'react';
import ProfileHome from './Activities/ProfileHome';
import ProfileLists from './Activities/ProfileLists';
import ProfileAbout from './Activities/ProfileAbout';
import Modal from '../../../utils/Modal';
import { LiaTimesSolid } from 'react-icons/lia';
import EditProfile from './EditProfile';
import { Blog } from '../../../Context/Context';
import { useParams } from 'react-router-dom';
import useSingleFetch from '../../hooks/useSingleFetch';
import FollowingModal from './FollowingModal';
import FollowersModal from './FollowersModal'; // Import FollowersModal
import FollowBtn from '../UserToFollow/FollowBtn';
import { IoSettingsSharp } from 'react-icons/io5';

const Profile = () => {
  const { allUsers, currentUser, postData } = Blog();
  const { userId } = useParams();

  const activities = [
    { title: "Paylaşımlar", comp: ProfileHome },
    { title: "Seçilənlər", comp: ProfileLists },
    { title: "Haqqında", comp: ProfileAbout },
  ];

  const [currentActive, setCurrentActive] = useState(activities[0]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [followModal, setFollowModal] = useState(false);
  const [followerModal, setFollowerModal] = useState(false); // State for the followers modal

  const getUserData = allUsers.find((user) => user.id === userId);

  const { data: follows } = useSingleFetch("users", userId, "follows");
  const { data: followers } = useSingleFetch("users", userId, "followers");

  const userPosts = Array.isArray(postData)
    ? postData.filter((post) => post?.userId === getUserData?.userId)
    : [];
  const postCount = userPosts.length;

  return (
    <section className="size flex gap-[4rem] relative transition-all duration-300">
      <div className="mt-[9rem] flex-[2]">
        <div className="flex gap-4 items-center dark:text-darkText">
          <h2 className="text-3xl sm:text-4xl font-bold capitalize">
            {getUserData?.username}
          </h2>
            {currentUser?.uid !== userId && (  
              <FollowBtn userId={userId} />
            )}
        </div>
        <div className='flex gap-4 mt-3 dark:text-darkText'>
          <p className="text-xs sm:text-sm cursor-pointer" onClick={() => setFollowerModal(true)}>
            İzləyici {followers.length}
          </p>
          <p className="text-xs sm:text-sm cursor-pointer" onClick={() => setFollowModal(true)}>
            İzləyir {follows.length}
          </p>
          <p className="text-xs sm:text-sm cursor-pointer">
            Paylaşım {postCount}
          </p>
        </div>
        <div className="flex items-center gap-5 mt-[1rem] border-b border-gray-300 mb-[3rem] dark:text-darkText">
          {activities.map((item, i) => (
            <div key={i} className={`py-[0.5rem] ${item.title === currentActive.title ? "border-b border-gray-500 dark:border-white" : ""}`}>
              <button onClick={() => setCurrentActive(item)}>{item.title}</button>
            </div>
          ))}
        </div>
        <currentActive.comp getUserData={getUserData} setEditModal={setEditModal} />
      </div>
   {/* button to open the side bar  */}
   <button
        onClick={() => setModal(true)}
        className="fixed top-[8rem] right-0 w-[2rem] h-[2rem] bg-black text-white dark:bg-darkText dark:text-black
        grid place-items-center md:hidden">
        <IoSettingsSharp />
      </button>
      <Modal modal={modal} setModal={setModal}>
        <div className={`flex-[1] border-l border-gray-300 p-[2rem] z-10 bg-white dark:bg-darkBg fixed right-0 bottom-0 top-0 w-[18rem]  md:sticky ${modal ? "translate-x-0" : "translate-x-[100%] md:translate-x-0"} transition-all duration-300`}>
          <div className="pb-4 text-right">
            <button onClick={() => setModal(false)} className="inline-block md:hidden">
              <LiaTimesSolid />
            </button>
          </div>
          <div className="sticky top-7 flex flex-col justify-between ">
            <img className="w-[3.5rem] h-[3.5rem] object-cover rounded-full" src={getUserData?.userImg || "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc="} alt="profile-img" />
            <h2 className="py-3 font-bold capitalize dark:text-darkText">
              {getUserData?.username}
            </h2>
            <p className="text-gray-500 first-letter:uppercase text-sm dark:text-darkText">
              {getUserData?.bio}
            </p>
            {currentUser?.uid === getUserData?.userId && (
              <button onClick={() => setEditModal(true)} className="text-green-700 pt-6 text-sm w-fit">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </Modal>

      {editModal && <EditProfile getUserData={getUserData} editModal={editModal} setEditModal={setEditModal} />}

      {/* Following Modal */}
      {followModal && (
        <FollowingModal
          modal={followModal}
          setModal={setFollowModal}
          follows={follows}
        />
      )}

      {/* Followers Modal */}
      {followerModal && (
        <FollowersModal
          modal={followerModal}
          setModal={setFollowerModal}
          followers={followers}
          userId={userId} 
        />
      )}
    </section>
  );
};

export default Profile;
