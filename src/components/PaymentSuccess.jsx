import React from "react";
import { Link } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";

function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition duration-500 hover:scale-[1.01]">
        <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Payment Successful! 🎉
        </h1>

        <p className="text-xl text-green-600 font-semibold mb-6">
          Your enrollment is complete.
        </p>

        <p className="text-gray-500 mb-8">
          You can now access your course materials from the "My Courses"
          section.
        </p>

        <Link
          to="/dashboard/my-courses"
          className="inline-block px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Go to My Courses
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
