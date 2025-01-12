import React from "react";
import { Blog } from "../../Context/Context";
import { BsGraphUpArrow } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { GrView } from "react-icons/gr";

const Trending = () => {
  const { postData } = Blog();
  const getTrending =
    postData && postData?.sort((a, b) => b.pageViews - a.pageViews);

  return (
    <section className="border-b border-gray-600 dark:text-darkText py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
          <BsGraphUpArrow className="text-green-500" />
          <h2 className="text-2xl">Diqqət çəkən paylaşımlar</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {getTrending &&
            getTrending
              .slice(0, 6)
              .map((trend, i) => <Trend trend={trend} key={i} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default Trending;

const Trend = ({ trend, index }) => {
  const getViews = trend.pageViews;
  const created = trend.created;
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 w-full p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
      <span className="text-gray-400 text-3xl font-semibold mt-2">{index + 1}</span>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3 mb-4">
          <div
            onClick={() => navigate(`/profile/${trend?.userId}`)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-75">
            <img
              className="w-8 h-8 object-cover rounded-full"
              src={trend?.userImg}
              alt="userImg"
            />
            <h2 className="text-sm font-medium capitalize text-gray-700 dark:text-gray-200">
              {trend?.username}
            </h2>
          </div>
        </div>
        <div
          onClick={() => navigate(`/post/${trend?.id}`)}
          className="flex flex-col gap-4 cursor-pointer hover:opacity-75">
          <p className="text-lg min-h-[60px] 2xl:text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {trend.title}
          </p>
          <span className="text-xs text-gray-600 flex items-center dark:text-gray-300">
            <GrView className="text-gray-500" />
            <p className="ml-2">{getViews}</p>
            <span className="mx-1">|</span>
            <p className="ml-1 capitalize">{moment(created).format("MMM DD, YYYY HH:mm")}</p>
          </span>
        </div>
      </div>
    </div>
  );
};
