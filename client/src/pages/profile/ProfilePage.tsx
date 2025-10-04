import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";


const API_URL = import.meta.env.VITE_API_URL;
type Post = { _id: string; text: string; createdAt?: string };
type UserData = {
  id?: string;
  name?: string;
  username: string;
  banner?: string;
  avatar?: string;
  bio?: string;
  joined?: string;
  following?: number;
  followers?: number;
};

type ProfilePageProps = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
};



const ProfilePage = ({ user, setUser }: ProfilePageProps) => {
  const { username } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const url =
          username && username !== "me"
            ? `${API_URL}/api/users/profile/${username}`
            : `${API_URL}/api/users/me`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUserData(data);

        // fetch posts
        const postsRes = await fetch(`${API_URL}/api/posts/user/${data.username}`);
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err: any) {
        setError(err.message);
        setUserData(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [username]);

  if (loading) return <div className="text-white p-4">Loading profile...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!userData) return <div className="text-red-500 p-4">User not found</div>;

  // helper to fix URL
  const getImageUrl = (path?: string) => (path ? (path.startsWith("http") ? path : API_URL + path) : "");

  return (
    <div className="text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{userData.name || userData.username}</h2>
        <p className="text-gray-400">@{userData.username}</p>
      </div>

      {/* Banner + Avatar */}
      <div className="relative">
        <div className="h-40 bg-gray-800">
          {userData.banner && (
            <img src={getImageUrl(userData.banner)} alt="Banner" className="w-full h-40 object-cover" />
          )}
        </div>

        <img
          className="w-32 h-32 rounded-full border-4 border-black absolute left-4 -bottom-14 object-cover"
          src={getImageUrl(userData.avatar) || "https://via.placeholder.com/150"}
          alt="Profile"
        />

        {/* Edit Profile Button */}
        {user && user.username === userData.username && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute right-4 px-4 py-1.5 bg-black text-white rounded-2xl border-1 border-gray-700 mt-4 font-medium hover:bg-neutral-900"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing && userData && (
        <EditProfileModal
          user={userData}
          onClose={() => setIsEditing(false)}
          setUserData={(updatedUser: UserData) => {
            setUserData(updatedUser);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }}
          setUser={setUser}
        />
      )}

      {/* Bio + Stats */}
      <div className="p-4 mt-12">
         <div className="flex items-center gap-6">
         <h2 className="text-xl font-bold">{userData.name || userData.username}</h2>
         <button className="px-4  bg-black text-white rounded-2xl border-1 border-gray-700  font-medium hover:bg-neutral-900">get verified</button>
         </div>
        <p className="text-gray-400">@{userData.username}</p>
        <p>{userData.bio || "No bio yet."}</p>
        <p className="text-gray-400 mt-2">
          Joined {userData.joined ? new Date(userData.joined).toDateString() : "N/A"}
        </p>
        <div className="flex gap-4 mt-2 text-gray-400">
          <span>
            <b className="text-white">{userData.following || 0}</b> Following
          </span>
          <span>
            <b className="text-white">{userData.followers || 0}</b> Followers
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="border-t border-gray-700">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="p-4 border-b border-gray-700 hover:bg-gray-900">
              <p>{post.text}</p>
              {post.createdAt && <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>}
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-400">No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
