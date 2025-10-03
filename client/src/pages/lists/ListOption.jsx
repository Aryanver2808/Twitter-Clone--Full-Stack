import React from "react";

const ListOption = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 🔲 Overlay background */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 🪟 Drawer panel */}
      <div className="absolute top-0 right-0 w-[350px] h-full bg-black text-white shadow-xl p-4">
        <h2 className="text-xl font-bold mb-4">More Options</h2>
        <p className="cursor-pointer hover:bg-gray-800 p-2 rounded">Topics</p>
        <p className="cursor-pointer hover:bg-gray-800 p-2 rounded">Bookmarks</p>
        <p className="cursor-pointer hover:bg-gray-800 p-2 rounded">Twitter Ads</p>
        <p className="cursor-pointer hover:bg-gray-800 p-2 rounded">Moments</p>
      </div>
    </div>
  );
};

export default ListOption;
