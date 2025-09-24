import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Post = {
  _id: string;
  text: string;
  createdAt?: string;
};

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

const ProfilePage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        let url = username
          ? `http://localhost:5000/api/users/${username}`
          : `http://localhost:5000/api/users/me`;

        // ✅ fetch user
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized – please log in again");
          if (res.status === 404) throw new Error("User not found");
          throw new Error(data.message || "Failed to fetch user");
        }

        setUserData(data);

        // ✅ fetch posts separately
        const postsRes = await fetch(
          `http://localhost:5000/api/posts/${data.username}`
        );
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

  if (loading) {
    return <div className="text-white p-4">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!userData) {
    return <div className="text-red-500 p-4">User not found</div>;
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{userData.name || userData.username}</h2>
        <p className="text-gray-400">@{userData.username}</p>
      </div>

      {/* Cover + Profile Image */}
      <div className="relative">
        <div className="h-40 bg-gray-800">
          {userData.banner && (
            <img
              src={userData.banner}
              alt="Banner"
              className="w-full h-40 object-cover"
            />
          )}
        </div>
        <img
          className="w-24 h-24 rounded-full border-4 border-black absolute left-4 -bottom-12"
          src={userData.avatar || "https://via.placeholder.com/150"}
          alt="Profile"
        />
      </div>

      {/* Bio + Stats */}
      <div className="p-4 mt-12">
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
            <div
              key={post._id}
              className="p-4 border-b border-gray-700 hover:bg-gray-900"
            >
              <p>{post.text}</p>
              {post.createdAt && (
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              )}
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
