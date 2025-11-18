import React from "react";
import { Link } from "react-router-dom";
import { HiXCircle } from "react-icons/hi";

function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition duration-500 hover:scale-[1.01]">
        <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-xl text-red-600 font-semibold mb-6">
          Your payment was not completed.
        </p>

        <p className="text-gray-500 mb-8">
          The payment process was interrupted or cancelled. Please try again or
          contact support if the issue persists.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 text-lg font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-150 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default PaymentCancel;
