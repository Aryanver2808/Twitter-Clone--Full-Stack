import Sidebar from "../pages/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import RightSidebar from "./rightSidebar/RightSildebar";

const HomePage = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center bg-black text-white min-h-screen">
      {/* Center wrapper */}
      <div className="flex w-full max-w-[1280px]">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-[170px] ml-[80px] border-r border-gray-700">
          {/* ✅ yahan App.js se mila user bhej rahe */}
          <Sidebar handlelogout={handleLogout} user={user} />
        </aside>

        {/* Feed */}
        <main className="w-[600px] border-r border-gray-700">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex w-[350px]">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
