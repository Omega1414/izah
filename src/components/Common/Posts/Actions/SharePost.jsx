import React, { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import {
  BiLink,
  BiLogoFacebookCircle,
  BiLogoTwitter,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { toast } from "react-toastify";
import Dropdown3 from "../../../../utils/DropDown3";

const SharePost = () => {
  const [showDrop, setShowDrop] = useState(false);
  const path = window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(path);
      toast.success("Link kopyalandı");
      setShowDrop(false);
    } catch (error) {
      toast.error(error.message);
      setShowDrop(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setShowDrop(!showDrop)}>
        <CiShare1 className="text-2xl" />
      </button>
      <Dropdown3 showDrop={showDrop} setShowDrop={setShowDrop} size="w-[12rem]">
        <div onClick={copyLink} className="p-2 hover:bg-gray-200 hover:text-black/80 w-full text-sm text-left flex items-center gap-2 cursor-pointer text-gray-500 dark:text-white">
          <span className="text-[1.2rem]"><BiLink /></span>
          Copy Link
        </div>

        {/* Using div instead of button to avoid nested button */}
        <TwitterShareButton url={path}>
          <div className="p-2 hover:bg-gray-200 hover:text-black/80 w-full text-sm text-left flex items-center gap-2 cursor-pointer text-gray-500 dark:text-white">
            <span className="text-[1.2rem]"><BiLogoTwitter /></span>
            Share On Twitter
          </div>
        </TwitterShareButton>

        <FacebookShareButton url={path}>
          <div className="p-2 hover:bg-gray-200 hover:text-black/80 w-full text-sm text-left flex items-center gap-2 cursor-pointer text-gray-500 dark:text-white">
            <span className="text-[1.2rem]"><BiLogoFacebookCircle /></span>
            Share On Facebook
          </div>
        </FacebookShareButton>

        <LinkedinShareButton url={path}>
          <div className="p-2 hover:bg-gray-200 hover:text-black/80 w-full text-sm text-left flex items-center gap-2 cursor-pointer text-gray-500 dark:text-white">
            <span className="text-[1.2rem]"><BiLogoLinkedinSquare /></span>
            Share On LinkedIn
          </div>
        </LinkedinShareButton>
      </Dropdown3>
    </div>
  );
};

export default SharePost;
