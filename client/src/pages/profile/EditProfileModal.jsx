import { useState, useEffect } from "react";

const SERVER_URL = "http://localhost:5000";

const EditProfileModal = ({ user, onClose, setUserData, setUser }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar ? (user.avatar.startsWith("http") ? user.avatar : SERVER_URL + user.avatar) : ""
  );
  const [bannerPreview, setBannerPreview] = useState(
    user.banner ? (user.banner.startsWith("http") ? user.banner : SERVER_URL + user.banner) : ""
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);
      if (banner) formData.append("banner", banner);

      const res = await fetch(`${SERVER_URL}/api/users/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("Profile updated successfully!");
      setUserData(data.user);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-start pt-10 z-50">
      <div className="bg-black w-[600px] rounded-xl shadow-xl relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-4"><button onClick={onClose} className="text-white font-semibold text-2xl hover:bg-neutral-900 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">×</button>
          <h2 className="font-bold text-xl mt-2">Edit Profile</h2>
          </div>
          <button onClick={handleSave} className="px-4 py-1 bg-white hover:bg-gray-200 text-black font-semibold rounded-full cursor-pointer">Save</button>
        </div>

        <div className="relative h-40 bg-gray-800">
          {bannerPreview && <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover rounded-t-xl" />}
          <label className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-sm rounded cursor-pointer hover:bg-black/70">
            Change Banner
            <input type="file" className="hidden" onChange={handleBannerChange} />
          </label>
        </div>

        <div className="relative px-4 -mt-12 mb-4">
          <div className="relative w-28 h-28">
            <img src={avatarPreview || "https://via.placeholder.com/150"} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-black object-cover" />
            <label className="absolute bottom-0 right-0 bg-black/50 text-white rounded-full p-1 cursor-pointer hover:bg-black/70">
              <input type="file" className="hidden" onChange={handleAvatarChange} />
              ✎
            </label>
          </div>
        </div>

        <div className="px-4 pb-4">
          <label className="block text-gray-400 text-sm mb-1">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 rounded bg-black text-white mb-4 border border-gray-700" />
          <label className="block text-gray-400 text-sm mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 rounded bg-black text-white mb-2 border border-gray-700" rows={3} />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
