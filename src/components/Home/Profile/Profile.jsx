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
import FollowBtn from '../UserToFollow/FollowBtn';
import Loading from '../../Loading/Loading';


const Profile = () => {
  const { allUsers, currentUser } = Blog();
  const { userId } = useParams(); // Get the userId from the URL

  const activities = [
    {
      title: "Home",
      comp: ProfileHome,
    },
    {
      title: "Lists",
      comp: ProfileLists,
    },
    {
      title: "About",
      comp: ProfileAbout,
    },
  ];

  const [currentActive, setCurrentActive] = useState(activities[0]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [followModal, setFollowModal] = useState(false); // State for the following modal

  const getUserData = allUsers.find((user) => user.id === userId);

  const { data: follows } = useSingleFetch("users", userId, "follows");
  const { data: followers } = useSingleFetch("users", userId, "followers");

  return (
    
    <section className="size flex gap-[4rem] relative">
      <div className="mt-[9rem] flex-[2]">
        <div className="flex gap-4 items-center">
          <h2 className="text-3xl sm:text-5xl font-bold capitalize">
            {getUserData?.username}
          </h2>
            {/* Follow/Unfollow button */}
            {currentUser?.uid !== userId && (  // Prevent current user from following/unfollowing themselves
            <FollowBtn userId={userId} />
          )}
       
        </div>
        <div className='flex gap-4 mt-3'>
        <p className="text-gray-500 text-xs sm:text-sm">
            Followers({followers.length})
          </p>
          <p
            className="text-gray-500 text-xs sm:text-sm cursor-pointer"
            onClick={() => setFollowModal(true)} // Show the following modal when clicked
          >
            Following({follows.length})
          </p>
          </div>
        <div className="flex items-center gap-5 mt-[1rem] border-b border-gray-300 mb-[3rem]">
          {activities.map((item, i) => (
            <div key={i} className={`py-[0.5rem] ${item.title === currentActive.title ? "border-b border-gray-500 dark:border-white" : ""}`}>
              <button onClick={() => setCurrentActive(item)}>{item.title}</button>
            </div>
          ))}
        </div>
        <currentActive.comp getUserData={getUserData} setEditModal={setEditModal} />
      </div>

      {/* Profile details */}
      <Modal modal={modal} setModal={setModal}>
        <div
          className={`flex-[1] border-l border-gray-300 p-[2rem] z-10
            fixed right-0 bottom-0 top-0 w-[18rem] bg-white dark:bg-gray-500 md:sticky
            ${modal ? "translate-x-0" : "translate-x-[100%] md:translate-x-0"}
            transition-all duration-500`}
        >
          <div className="pb-4 text-right">
            <button onClick={() => setModal(false)} className="inline-block md:hidden">
              <LiaTimesSolid />
            </button>
          </div>
          <div className="sticky top-7 flex flex-col justify-between">
            <img
              className="w-[3.5rem] h-[3.5rem] object-cover rounded-full"
              src={getUserData?.userImg || "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc="}
              alt="profile-img"
            />
            <h2 className="py-2 font-bold capitalize">
              {getUserData?.username}
            </h2>
            <p className="text-gray-500 first-letter:uppercase text-sm">
              {getUserData?.bio}
            </p>
            {currentUser?.uid === getUserData?.userId && (
              <button
                onClick={() => setEditModal(true)}
                className="text-green-700 pt-6 text-sm w-fit"
              >
                Edit Profile
              </button>
            )}
            <div className="flex-[1] flex items-center flex-wrap gap-3 pt-8">
              {/* Action buttons */}
            </div>
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
    </section>
  );
};

export default Profile;
