import { useState } from "react";

import { Avatar } from "@mui/material";
import {
  ChatBubbleOutline,
  Repeat,
  FavoriteBorder,
  BarChartOutlined,
  BookmarkBorder,
  DownloadOutlined,
  MoreHoriz,
} from "@mui/icons-material";

export default function Tweet({ tweet, user }) {
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [liked, setLiked] = useState(false);

  const avatar = tweet.avatar || user?.avatar || "/avatars/default.png";
const name = tweet.name || user?.name || "Guest";
const username = tweet.username || user?.username || "@guest";


  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div className="flex p-4 border-b border-gray-700 hover:bg-neutral-900 transition-colors gap-3 cursor-pointer">
      <Avatar src={tweet.avatar} alt={tweet.name} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 ">
          <div className="flex items-center gap-0.5">
             <span className="font-semibold text-white hover:underline ml-1">{tweet.name}</span>
              <img
      src="/avatars/verified.png"
      className="w-6 h-6  "
    />
    </div> 
            <span className="text-gray-400 text-sm mt-0.5  ">{tweet.username}</span>
            <span className="text-gray-400 text-sm mt-0.5 hover:underline">{tweet.createdAt}</span>
          </div>
          <div className="flex items-center text-xs gap-1 hover:text-sky-500 ">
            <MoreHoriz />
          </div>

        </div>

        <p className="text-white mt-1">{tweet.content}</p>

        {tweet.image && (
          <img
            src={tweet.image}
            alt="tweet image"
            className="w-full max-h-80 rounded-md object-cover mb-2 mt-2"
          />
        )}


       
        <div className="flex justify-between mt-4 text-gray-400 text-xs">
          <div className="flex items-center text-xs gap-1 hover:text-sky-500 ">
            <ChatBubbleOutline /> {tweet.comments || 0}
          </div>

          <div className="flex items-center gap-1 hover:text-green-500 ">
            <Repeat /> {tweet.retweets || 0}
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${liked ? "text-red-500" : "hover:text-red-500 "}`}
          >
            <FavoriteBorder /> {likes}
          </button>

          <div className="flex items-center gap-1 hover:text-sky-400 ">
            <BarChartOutlined /> {tweet.views || 0}
          </div>
          <div className="flex flex-row items-center gap-1 ">
            <div className="flex items-center gap-1 hover:text-gray-300 ">
              <DownloadOutlined />
            </div>
            <div className="flex items-center gap-1 hover:text-yellow-500 ">
              <BookmarkBorder />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
