import React from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBan,
  FaUnlock,
} from "react-icons/fa";
import EmailRequestModel from "./EmailRequestModel";
import userService from '../codingsena/userService';
import { toast } from "react-toastify";

function UserManagement() {
  const baseCardStyle =
    "cursor-pointer block h-full p-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1";

  const [isPromoteModalOpen, setPromoteModalOpen] = React.useState(false);
  const [isDemoteModalOpen, setDemoteModalOpen] = React.useState(false);
  const [isBlockModalOpen, setBlockModalOpen] = React.useState(false);
  const [isUnblockModalOpen, setUnblockModalOpen] = React.useState(false);

  const handlePromoteUser = () => {
    setPromoteModalOpen(true);
  }
  const handlePromoteUserSubmit = async (data, reset) => {
    try {
        const response = await userService.promoteUserToTrainer(data.userEmail);
        if(response?.success) {
            toast.success(response.message || "User promoted to Trainer successfully!");
            reset();
            setPromoteModalOpen(false);
        }
        else {
            toast.error(response.message || "Failed to promote user.");
        }
    } catch (error) {
        toast.error(error?.message || "An error occurred while promoting the user.");
    }
  }

  const handleDemoteUser = () => {
    setDemoteModalOpen(true);
  }
  const handleDemoteUserSubmit = async (data, reset) => {
    try {
        const response = await userService.demoteTrainerToLearner(data.userEmail);
        if(response?.success) {
            toast.success(response.message || "Trainer demoted to Learner successfully!");
            reset();
            setDemoteModalOpen(false);
        }
        else {
            toast.error(response.message || "Failed to demote trainer.");
        }
    } catch (error) {
        toast.error(error?.message || "An error occurred while demoting the trainer.");
    }
  }

  const handleBlockUser = () => {
    setBlockModalOpen(true);
  }
  const handleBlockUserSubmit = async (data, reset) => {
    try {
        const response = await userService.blockUser(data.userEmail);
        if(response?.success) {
            toast.success(response.message || "User blocked successfully!");
            reset();
            setBlockModalOpen(false);
        }
        else {
            toast.error(response.message || "Failed to block user.");
        }
    } catch (error) {
        toast.error(error?.message || "An error occurred while blocking the user.");
    }
  }

  const handleUnblockUser = () => {
    setUnblockModalOpen(true);
  }
  const handleUnblockUserSubmit = async (data, reset) => {
    try {
        const response = await userService.unblockUser(data.userEmail);
        if(response?.success) {
            toast.success(response.message || "User unblocked successfully!");
            reset();
            setUnblockModalOpen(false);
        }
        else {
            toast.error(response.message || "Failed to unblock user.");
        }
    } catch (error) {
        toast.error(error?.message || "An error occurred while unblocking the user.");
    }
  }

  const userActions = [
    {
      label: "Promote User to Trainer",
      icon: FaArrowUp,
      onclick: handlePromoteUser,
      style: "bg-teal-500 text-white shadow-teal-300/50 hover:bg-teal-600",
    },
    {
      label: "Demote User to Learner",
      icon: FaArrowDown,
      onclick: handleDemoteUser,
      style: "bg-gray-100 text-indigo-700 shadow-lg shadow-gray-200/50 border-2 border-indigo-200 hover:border-indigo-400",
    },
    {
      label: "Block User",
      icon: FaBan,
      onclick: handleBlockUser,
      style: "bg-red-500 text-white shadow-red-300/50 hover:bg-red-600",
    },
    {
      label: "Unblock User",
      icon: FaUnlock,
      onclick: handleUnblockUser,
      style:
        "bg-gray-100 text-indigo-700 shadow-lg shadow-gray-200/50 border-2 border-indigo-200 hover:border-indigo-400",
    },
  ];

  return (
    <>
    <EmailRequestModel
        isOpen={isPromoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        title={"Promote User to Trainer"}
        onSubmit={handlePromoteUserSubmit}
        label="User Email"
    />
    <EmailRequestModel
        isOpen={isDemoteModalOpen}
        onClose={() => setDemoteModalOpen(false)}
        title={"Demote User to Learner"}
        onSubmit={handleDemoteUserSubmit}
        label="Trainer Email"
    />
    <EmailRequestModel
        isOpen={isBlockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        title={"Block User"}
        onSubmit={handleBlockUserSubmit}
        label="User Email"
    />
    <EmailRequestModel
        isOpen={isUnblockModalOpen}
        onClose={() => setUnblockModalOpen(false)}
        title={"Unblock User"}
        onSubmit={handleUnblockUserSubmit}
        label="User Email"
    />
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-3">
        User Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {userActions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.label} className="flex flex-col">
              <div
                onClick={action.onclick}
                className={`
                  text-left no-underline focus:ring-4 focus:ring-indigo-300 focus:outline-none
                  ${baseCardStyle}
                  ${action.style}
                `}
              >
                <div className="flex items-center font-bold text-lg">
                  <Icon className="mr-3 text-2xl" />
                  {action.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

export default UserManagement;