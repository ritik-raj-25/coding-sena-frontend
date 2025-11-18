import React from "react";

function DetailBox({ title, value, icon }) {
  return (
    <div className="flex flex-col items-start space-y-1">
      <div className="flex items-center text-blue-500">
        {icon}
        <span className="text-sm font-semibold ml-1">{title}</span>
      </div>
      <p className="text-lg font-medium text-gray-800">{value}</p>
    </div>
  );
}

export default DetailBox;