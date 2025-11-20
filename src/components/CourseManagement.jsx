import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserGraduate,
  FaMinusCircle,
  FaTrashRestore,
} from "react-icons/fa";

function CourseManagement() {
  const baseCardStyle =
    "cursor-pointer block h-full p-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1";

  const managementActions = [
    {
      label: "Add New Course",
      icon: FaPlus,
      path: "/dashboard/admin/add-course",
      style: "bg-teal-500 text-white shadow-teal-300/50 hover:bg-teal-600",
    },
    {
      label: "Edit Course",
      icon: FaEdit,
      path: "/courses",
      style:
        "bg-gray-100 text-indigo-700 shadow-lg shadow-gray-200/50 border-2 border-indigo-200 hover:border-indigo-400",
    },
    {
      label: "Delete Course",
      icon: FaTrash,
      path: "/courses",
      style: "bg-red-500 text-white shadow-red-300/50 hover:bg-red-600",
    },
    {
      label: "Restore Course",
      icon: FaTrashRestore,
      path: "/courses",
      style:
        "bg-gray-100 text-indigo-700 shadow-lg shadow-gray-200/50 border-2 border-indigo-200 hover:border-indigo-400",
    },
    {
      label: "Assign Trainer to Course",
      icon: FaUserGraduate,
      path: "/courses",
      style:
        "bg-gray-100 text-indigo-700 shadow-lg shadow-gray-200/50 border-2 border-indigo-200 hover:border-indigo-400",
    },
    {
      label: "Remove Trainer from Course",
      icon: FaMinusCircle,
      path: "/courses",
      style:
        "bg-gray-100 text-indigo-700 shadow-lg shadow-gray-200/50 border-2 border-indigo-200 hover:border-indigo-400",
    },
  ];

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-3">
        Course Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {managementActions.map((action) => {
          const IconComponent = action.icon;

          return (
            <div key={action.label} className="flex flex-col">
              <Link
                to={action.path}
                className={`
                  text-left no-underline focus:ring-4 focus:ring-indigo-300 focus:outline-none 
                  ${baseCardStyle}
                  ${action.style}
                `}
              >
                <div className="flex items-center justify-start font-bold text-lg">
                  <IconComponent className="mr-3 text-2xl" />
                  {action.label}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourseManagement;