import React from "react";
import { FiX } from "react-icons/fi";
import Button from "./fields/Button";
import { MdErrorOutline } from "react-icons/md";

function TestReportModel({ isOpen, onClose, data, onDownload }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-xl font-semibold text-indigo-700">
            Test Report Summary
          </h3>

          <button onClick={onClose}>
            <FiX
              size={24}
              className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
            />
          </button>
        </div>

        {!data || data.length === 0 ? (
          <div className="p-6 flex justify-center items-center h-[70vh] text-gray-500">
            <div className="border-indigo-600 border-4 rounded-full w-12 h-12 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {data.map((item, idx) => {
              const scoreColor =
                item.score >= 70
                  ? "text-green-700"
                  : item.score >= 40
                  ? "text-yellow-700"
                  : "text-red-700";

              const isTempered = item.isTestAttemptTempered;

              return (
                <div
                  key={idx}
                  className={`p-4 border rounded-lg space-y-3 ${
                    isTempered
                      ? "bg-red-50 border-red-400 text-red-800"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  {isTempered && (
                    <span className="inline-block px-3 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-md border border-red-300">
                      <MdErrorOutline className="h-4 w-4 mr-1.5 flex-shrink-0 inline" />
                      Tempered Attempt
                    </span>
                  )}

                  <div>
                    <p className="text-sm font-medium">Email:</p>
                    <p className={`text-lg font-semibold`}>{item.userEmail}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Score:</p>
                    <p
                      className={`text-2xl font-bold ${
                        isTempered ? "text-red-800" : scoreColor
                      }`}
                    >
                      {item.score}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            onClick={onDownload}
            bgColor="bg-indigo-600"
            textColor="text-white"
            className="rounded-lg px-6 hover:bg-indigo-700 cursor-pointer"
          >
            Download Report
          </Button>

          <Button
            onClick={onClose}
            bgColor="bg-gray-200"
            textColor="text-gray-800"
            className="rounded-lg px-6 hover:bg-gray-300 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestReportModel;