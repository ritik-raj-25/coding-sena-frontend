import React from "react";
import { IoStatsChart, IoTimeOutline, IoRepeat } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function TestCard({
  id,
  title,
  isActive,
  description,
  difficultyLevel,
  totalMarks,
  duration,
  maxAttempts,
  startTime,
  endTime,
  courseId,
  isBatchTrainerOrAdmin,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`${
        isActive ? "bg-white" : "bg-gray-100"
      } rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1`}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-indigo-700 break-words">
            {title}
          </h2>
          {isBatchTrainerOrAdmin && (
            <div className="flex gap-2 flex-shrink-0 ml-2">
              <button
                onClick={onEdit}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer hover:scale-110 transition-transform"
              >
                <FaEdit size={18} />
              </button>
              {isActive && (
                <button
                  onClick={onDelete}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer hover:scale-110 transition-transform"
                >
                  <FaTrash size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 text-sm">{description}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
          <div className="flex items-center text-gray-700">
            <IoStatsChart className="h-5 w-5 mr-2 text-indigo-500" />
            <span className="font-medium">Difficulty:</span>
            <span className="ml-1.5">{difficultyLevel}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MdOutlineVerified className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">Marks:</span>
            <span className="ml-1.5">{totalMarks}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <IoTimeOutline className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium">Duration:</span>
            <span className="ml-1.5">{duration} min</span>
          </div>
          <div className="flex items-center text-gray-700">
            <IoRepeat className="h-5 w-5 mr-2 text-yellow-600" />
            <span className="font-medium">Attempts:</span>
            <span className="ml-1.5">{maxAttempts}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 mb-1">
            <strong>Starts:</strong>{" "}
            {new Date(startTime).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-xs text-gray-500">
            <strong>Ends:</strong>{" "}
            {new Date(endTime).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <Link
        className="mt-6 text-center w-full bg-indigo-600 text-white rounded-md py-2 px-4 font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        to={`/my-courses/${courseId}/tests/${id}`}
      >
        View Details
      </Link>
    </div>
  );
}

export default TestCard;