import React, { useEffect, useState } from 'react';
import { Blog } from '../../../../Context/Context';
import moment from 'moment'; // Import moment to format the date

const ProfileAbout = ({ getUserData, setEditModal }) => {
  const { currentUser } = Blog();
  const [createdDate, setCreatedDate] = useState(null);

  useEffect(() => {
    if (getUserData?.created) {
      let formattedDate;

      // If created is a Firestore Timestamp object
      if (getUserData.created.toDate) {
        formattedDate = moment(getUserData.created.toDate()).format('MMMM DD YYYY, h:mm A');
      } else if (getUserData.created instanceof Date) {
        // If it's already a Date object
        formattedDate = moment(getUserData.created).format('MMMM DD YYYY, h:mm A');
      } else {
        // If it's a string (assuming it's in a valid date format)
        formattedDate = moment(getUserData.created).format('MMMM DD YYYY, h:mm A');
      }

      setCreatedDate(formattedDate);
    }
  }, [getUserData]);

  return (
    <div className='w-full'>
      <p className='text-2xl first-letter:uppercase'>
        {getUserData?.bio || getUserData?.username + " bio mövcud deyil"}
      </p>

      {/* Display creation date after the bio */}
      {createdDate && (
        <p className="text-sm text-gray-500 mt-3 capitalize dark:text-gray-400">
          <strong>Qoşulub:</strong> {createdDate}
        </p>
      )}

      <div className='text-right'>
        {currentUser?.uid === getUserData?.userId && (
          <button onClick={() => setEditModal(true)} className='border border-black py-2 px-5 rounded-full text-black mt-[3rem]'>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileAbout;
