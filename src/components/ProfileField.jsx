import React from "react";

const ProfileField = ({ label, value, isSkill = false }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-3 border-b border-gray-100">
    <span className="text-sm font-semibold text-gray-500 w-40 flex-shrink-0 mb-1">
      {label}
    </span>
    {isSkill ? (
      <div className="flex flex-wrap gap-2">
        {(value || []).map((skill) => (
          <span
            key={skill.id}
            className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
          >
            {skill.title}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-base font-medium text-gray-800">
        {value}
      </span>
    )}
  </div>
);

export default ProfileField;