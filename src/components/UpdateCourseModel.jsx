import React from "react";
import AddAndUpdateCourse from "./AddAndUpdateCourse";
import { FaTimes } from "react-icons/fa";
import Button from "./fields/Button";
import { FiX } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

function UpdateCourseModel({isOpen, onClose, onSuccess, courseData}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-xl font-semibold text-indigo-700">
            <FaEdit className="inline mr-2" />
            Update Course
          </h3>

          <button type="button" onClick={onClose}>
            <FiX
              size={24}
              className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
            />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
            <AddAndUpdateCourse courseData={courseData} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}

export default UpdateCourseModel;