import { Search } from "lucide-react";

export default function RightSidebar() {
  const trends = [
    { id: 1, category: "Technology · Trending", topic: "ReactJS", tweets: "120K Tweets" },
    { id: 2, category: "AI · Trending", topic: "OpenAI", tweets: "90K Tweets" },
    { id: 3, category: "India · Trending", topic: "India", tweets: "75K Tweets" },
  ];

  const suggestions = [
    {
      id: 1,
      username: "elonmusk",
      name: "Elon Musk",
      img: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
    },
    {
      id: 2,
      username: "naval",
      name: "Naval Ravikant",
      img: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
    },
    {
      id: 3,
      username: "sundarpichai",
      name: "Sundar Pichai",
      img: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
    },
  ];

  return (
    <section className="w-full hidden top-2 mt-2 xl:flex flex-col px-2 ">
      {/* Sticky Search Bar */}
      <div className=" sticky top-0 bg-black/70  backdrop-blur-md pb-1 z-10">
        <div className="sticky top-2 flex items-center bg-black rounded-full px-3 py-3 border border-gray-700">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none px-2 text-white text-sm w-full"
          />
        </div>
      </div>

      {/* Normal scrolling content */}
      <div className="space-y-4 mt-4 sticky">
        {/* Trends Section */}
        <div className="bg-black rounded-2xl px-4 py-3 border border-gray-700">
          <h2 className="font-bold text-lg mb-3">What’s happening</h2>
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="mb-3 cursor-pointer hover:bg-gray-800 px-2 py-2 rounded-lg"
            >
              <p className="text-gray-400 text-xs">{trend.category}</p>
              <p className="font-bold">{trend.topic}</p>
              <p className="text-gray-400 text-xs">{trend.tweets}</p>
            </div>
          ))}
          <p className="text-sky-500 text-sm cursor-pointer hover:underline">Show more</p>
        </div>

        {/* Who to follow */}
        <div className="bg-black rounded-2xl px-4 py-3 border border-gray-700">
          <h2 className="font-bold text-lg mb-3">Who to follow</h2>
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center mb-3 hover:bg-gray-800 px-2 py-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-gray-400 text-xs">@{user.username}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm font-bold">
                Follow
              </button>
            </div>
          ))}
          <p className="text-sky-500 text-sm cursor-pointer hover:underline">Show more</p>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1 leading-relaxed">
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Cookie Policy</span>
          <span className="hover:underline cursor-pointer">Accessibility</span>
          <span className="hover:underline cursor-pointer">Ads info</span>
          <span className="hover:underline cursor-pointer">More…</span>
          <span>© 2025 X Corp.</span>
        </div>
      </div>
    </section>
  );
}
