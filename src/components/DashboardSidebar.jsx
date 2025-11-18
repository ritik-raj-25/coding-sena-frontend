import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function DashboardSidebar() {
    const authSlice = useSelector((state) => state.authSlice);
    let roles = authSlice.userData?.roles?.map(role => role.roleName) || [];
    
    const navOptions = [
        // Learner options
        {
            name: "My Courses",
            link: "my-courses",
            isActive: roles.includes("ROLE_LEARNER") && !roles.includes("ROLE_ADMIN"),
        },
        {
            name: "View Profile",
            link: "view-profile",
            isActive: roles.includes("ROLE_LEARNER"),
        },
        {
            name: "Update Profile",
            link: "update-profile",
            isActive: roles.includes("ROLE_LEARNER"),
        },
        
        // Trainer options
        {
            name: "Manage Courses",
            link: "manage-courses",
            isActive: roles.includes("ROLE_TRAINER") && !roles.includes("ROLE_ADMIN"),
        },

        // Admin options
        {
            name: "User Management",
            link: "admin/user-management",
            isActive: roles.includes("ROLE_ADMIN"),
        },
        
        {
            name: "More Options",
            link: "admin/more-options",
            isActive: roles.includes("ROLE_ADMIN"),
        },


        // Learner and Trainer options
        {
            name: "Deactivate Account",
            link: "deactivate-account",
            isActive: roles.includes("ROLE_LEARNER") && !roles.includes("ROLE_ADMIN") && !authSlice.userData?.isDeleted,
        },
    ]

    const activeNavOptions = navOptions.filter(option => option.isActive);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg h-full overflow-y-auto">
            <h3 className="text-lg font-bold text-indigo-900 mb-3 border-b pb-2">Navigation</h3>
            <div className="flex flex-col space-y-2">
                {activeNavOptions.map((option) => (
                    <NavLink
                        to={option.link}
                        key={option.name}
                        className={({ isActive }) => 
                            `w-full text-left py-3 px-4 rounded-lg font-medium transition duration-200 text-sm ${
                                isActive 
                                    ? 'bg-yellow-400 text-indigo-900 shadow-md' 
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                            }`
                        }
                    >
                        {option.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default DashboardSidebar;