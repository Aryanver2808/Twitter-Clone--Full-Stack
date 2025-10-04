import Sidebar from "../pages/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import RightSidebar from "./rightSidebar/RightSidebar";

const HomePage = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
   <div className="flex justify-center bg-black text-white min-h-screen">
  <div className="flex w-full max-w-[1280px]">
    {/* Left Sidebar */}
    <aside className="hidden lg:flex w-[170px] ml-[80px] border-r border-gray-700">
      <Sidebar handlelogout={handleLogout} user={user} />
    </aside>

    {/* Feed */}
    <main className="w-[600px] border-r border-gray-700">
      <Outlet />
      
    </main>
    
      <aside className="hidden xl:flex w-[350px] ">
            <RightSidebar />
        </aside>
    
    
    
  </div>
</div>

  );
};

export default HomePage;
