import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./fields/Button";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      
      <h1 className="text-9xl font-extrabold text-indigo-600 tracking-tight">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
        Page Not Found
      </h2>
      
      <p className="text-lg text-gray-500 mt-3">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-8">
        <Button
          onClick={() => navigate(-1)}
          bgColor="bg-indigo-600"
          textColor="text-white"
          className="px-6 py-3 text-lg font-medium hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default Error;