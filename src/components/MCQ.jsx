import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

function MCQ({
  id,
  question,
  optionA,
  optionB,
  optionC,
  optionD,
  onSelectAnswer,
  selectedOption,
}) {

  const options = [
    { key: "A", text: optionA },
    { key: "B", text: optionB },
    { key: "C", text: optionC },
    { key: "D", text: optionD },
  ].filter((opt) => opt.text);

  const handleOptionClick = (optionKey) => { 
    onSelectAnswer(id, optionKey);
  };

  return (
    <div>
      <div className="mb-4">
        <p className="font-semibold text-lg text-gray-800 mb-3">Question:</p>
        <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-x-auto whitespace-pre-wrap font-sans text-base">
          <ReactMarkdown>{question}</ReactMarkdown>
        </pre>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-800">Options:</p>
        {options.map((option) => {
          const isSelected = selectedOption === option.key;
          return (
            <div
              key={option.key}
              onClick={() => handleOptionClick(option.key)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all
                ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-500 shadow-md" 
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              <div
                className={`flex-1 ${
                  isSelected ? "text-indigo-900" : "text-gray-700"
                }`}
              >
                <span className="font-medium">{option.key}:</span>
                <pre className="inline ml-2 whitespace-pre-wrap font-sans align-middle">
                  <ReactMarkdown>{option.text}</ReactMarkdown>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MCQ;