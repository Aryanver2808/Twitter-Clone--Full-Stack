import { useState } from "react";
import { Avatar } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";


export default function Tweet({ tweet,user }) {
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [liked, setLiked] = useState(false);
  

  const username = user?.username || "guest";

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div className="flex p-4 border-b border-gray-700 hover:bg-gray-900 transition-colors gap-3">
      <Avatar
        src={`https://cdn-icons-png.flaticon.com/512/149/149071.png`}
        alt={tweet.username}
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-semibold text-white">{tweet.username}</span>
          <span className="text-gray-400 text-sm">{tweet.createdAt}</span>
        </div>
        <p className="text-white mt-1">{tweet.content}</p>

        {tweet.image && (
          <img
            src={tweet.image}
            alt="post"
            className="mt-2 rounded-md max-h-80 w-full object-cover"
          />
        )}

        <div className="flex gap-6 mt-2 text-gray-400">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${liked ? "text-red-500" : "hover:text-red-500"}`}
          >
            <FavoriteBorderIcon /> {likes}
          </button>
          <button className="flex items-center gap-1 hover:text-sky-500">
            <ChatBubbleOutlineIcon /> {tweet.comments || 0}
          </button>
          <button className="flex items-center gap-1 hover:text-green-500">
            <RepeatIcon /> Repost
          </button>
        </div>
      </div>
    </div>
  );
}
