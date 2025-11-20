import React from "react";
import { Link } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";

function MoreOption() {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-3">
        More Options
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link
          to="/dashboard/admin/create-skill"
          className="cursor-pointer block h-full p-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1
          bg-yellow-400 text-white shadow-yellow-300/50 hover:bg-yellow-500
          text-left no-underline focus:ring-4 focus:ring-indigo-300 focus:outline-none"
        >
          <div className="flex items-center justify-start font-bold text-lg">
            <FaLightbulb className="mr-3 text-2xl" />
            Create New Skill
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MoreOption;