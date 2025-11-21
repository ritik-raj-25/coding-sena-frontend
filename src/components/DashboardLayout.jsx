import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardSidebar from "./DashboardSidebar";
import defaultProfilePic from "../assets/default_profile_image.png";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import authService from "../codingsena/authService";
import { toast } from 'react-toastify';
import Button from "./fields/Button";
import { FaBars, FaTimes } from 'react-icons/fa'; 

function DashboardLayout() {
  const authSlice = useSelector((state) => state.authSlice);
  const roles = authSlice.userData?.roles?.map((role) => role.roleName) || [];
  const userName = authSlice.userData?.name?.split(" ")[0] || "User";
  const profilePicUrl = authSlice.userData?.profilePicUrl || defaultProfilePic;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const getRoleDescription = () => {
    if (roles.includes("ROLE_ADMIN")) {
      return "Central Hub for System Management and Oversight.";
    }
    if (roles.includes("ROLE_TRAINER")) {
      return "Central Hub for Course and Student Management.";
    }
    return "Central Hub for Your Learning and Account.";
  };

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response?.success) {
        dispatch(logout());
        toast.success(response?.message || "Logged out successfully.");
        setIsSidebarOpen(false); 
        setTimeout(() => { 
          navigate('/');
        }, 50);
      }
      else {
        toast.error(response?.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error(error?.message || "Logout failed. Please try again.");
    }
  };

  if (!authSlice.status) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-500 p-6 rounded-lg shadow-md bg-white">
          Please log in to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full space-y-6">
        
        <div className="py-2 sm:py-4 w-full border-b border-indigo-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-4">
            <img
              src={profilePicUrl}
              alt="Profile Pic"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
            />
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-900">
                Hello, <span className="text-yellow-500">{userName}!</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {getRoleDescription()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4"> 
            <Button
              onClick={handleLogout}
              className={`bg-red-500 text-white hover:bg-red-600 px-6 py-3 font-medium rounded-xl transition duration-300 shadow-md text-sm hidden md:inline-flex cursor-pointer`} 
            >
              Logout
            </Button>

            <button
              onClick={toggleSidebar}
              className="text-indigo-800 text-2xl p-2 md:hidden cursor-pointer" 
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        <div className="grid w-full grid-cols-1 h-full md:grid-cols-[250px_1fr] gap-6 flex-grow min-h-0 relative pb-4">
          
          <aside 
            className={`
              md:block h-full 
              ${isSidebarOpen 
                ? 'block absolute z-20 w-64 top-0 left-0 bg-white rounded-2xl' 
                : 'hidden'
              }
            `}
          >
            <DashboardSidebar/>
          </aside>

          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}
          
          <div className="bg-white w-full p-6 rounded-2xl shadow-lg h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>

        <div className="mt-4 md:hidden flex-shrink-0">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white hover:bg-red-600 py-3 font-medium rounded-xl transition duration-300 shadow-lg text-lg cursor-pointer"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;