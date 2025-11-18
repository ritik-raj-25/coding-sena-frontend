import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = null,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-screen z-100 flex items-center justify-center bg-gray-900/60"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-11/12 max-w-5xl h-[90vh] bg-gray-800 rounded-lg shadow-xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 bg-gray-900 text-white flex-shrink-0">
          <h3 className="font-semibold truncate pr-4">{title}</h3>
          <div className="flex items-center gap-4">
            {actions}
            <button
              onClick={onClose}
              title="Close"
              className="text-xl hover:text-red-500 transition-colors"
            >
              <FaTimes className="cursor-pointer"/>
            </button>
          </div>
        </div>
        <div className="flex-grow relative">{children}</div>
      </div>
    </div>
  );
};

export default Modal;