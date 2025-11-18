import React from "react";
import { GoClock } from "react-icons/go";
import { HiMiniUsers } from "react-icons/hi2";
import Button from "./fields/Button";
import { useNavigate } from "react-router-dom";

function CourseCard({
  courseCoverImage,
  courseTitle,
  courseDuration,
  currentEnrollments,
  onClick,
  isUserAdmin,
}) {

  return (
    <div
      onClick={onClick}
      className="
            max-w-[400px] w-full h-[480px] 
            bg-white 
            rounded-xl overflow-hidden
            shadow-md hover:shadow-xl transition-shadow duration-300
            cursor-pointer
        "
    >
      <div className="p-3 w-full h-full flex flex-col justify-between">
        <div className="w-full h-[294px] flex-shrink-0 overflow-hidden rounded-sm">
          <img
            src={courseCoverImage}
            alt={courseTitle}
            className="w-full h-full"
          />
        </div>

        <div className="flex flex-col justify-between flex-grow pt-2">
          <h2
            className="
                          text-xl font-bold 
                          text-gray-900
                      "
          >
            {courseTitle}
          </h2>

          <div className="w-full border-t border-gray-100 mt-auto mb-2"></div>

          <div className="flex justify-start items-center gap-4 text-gray-600 text-base">
            <p className="flex items-center gap-1.5">
              <GoClock />
              {courseDuration}
            </p>   
            <p className="flex items-center gap-1.5">
              <HiMiniUsers />
              {currentEnrollments} Enrolled
            </p>
          </div>
          {isUserAdmin ? (
            <Button 
              onClick={onClick}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer"
            >
              Manage Course
            </Button>
          ) : (
            <Button
              className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer"
              onClick={onClick}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;