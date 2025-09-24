import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const NotificationPage = () => {
  const [tab, setTab] = useState("all");

  // Dummy notifications (replace later with backend data)
  const notifications = [
    {
      id: 1,
      type: "like",
      user: "JohnDoe",
      message: "liked your post",
    },
    {
      id: 2,
      type: "follow",
      user: "JaneSmith",
      message: "followed you",
    },
    {
      id: 3,
      type: "mention",
      user: "DevGuy",
      message: "mentioned you in a post",
    },
  ];

  const filtered =
    tab === "All"
      ? notifications
      : notifications.filter((n) => n.type === tab);

  return (
    <div className="flex flex-col w-[600px] border-x border-gray-700 min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-md border-b border-gray-700">
        <h2 className="text-xl font-bold p-4">Notifications</h2>

        {/* Tabs */}
        <div className="flex">
          {["All","Verified", "Mention"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-center text-sm font-medium transition ${
                tab === t ? "border-b-2 border-sky-500 text-white" : "text-gray-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <div
              key={n.id}
              className="flex items-center gap-3 p-4 border-b border-gray-700 hover:bg-gray-900 transition"
            >
              {/* Icon based on type */}
              {n.type === "like" && (
                <FavoriteBorderIcon className="text-pink-500" />
              )}
              {n.type === "follow" && (
                <PersonAddAltIcon className="text-sky-500" />
              )}
              {n.type === "mention" && (
                <NotificationsIcon className="text-yellow-500" />
              )}

              <p>
                <span className="font-semibold">{n.user}</span> {n.message}
              </p>
            </div>
          ))
        ) : (
            <div className="p-4 text-gray-400 ">No notifications yet</div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
