import React from "react";
import { FaRegComment } from "react-icons/fa";
import { Blog } from "../../../../Context/Context";
import { formatNum } from "../../../../utils/helper";

const Comment = ({ onClick }) => {
  const { commentLength, currentUser, setAuthModel } = Blog();

  const handleClick = () => {
    // If the user is not logged in, perform both actions
    if (!currentUser) {
      setAuthModel(true);  // Close the authentication modal
      onClick()
    } else{
      onClick()
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-sm"
    >
      <FaRegComment className="text-lg text-gray-500 dark:text-blue-300" />
      <span className="text-gray-500 dark:text-blue-300">{formatNum(commentLength)}</span>
    </button>
  );
};

export default Comment;
