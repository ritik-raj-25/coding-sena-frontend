import React, { useState, useEffect, useRef } from "react";
import { IoTimeOutline } from "react-icons/io5";

function TestTimer({ durationInMinutes, onTimeUp }) {
  const [remainingTime, setRemainingTime] = useState(durationInMinutes * 60); // in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    if (durationInMinutes > 0) {
      setRemainingTime(durationInMinutes * 60);
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [durationInMinutes]);

  useEffect(() => {
    if (remainingTime <= 0) {
      clearInterval(timerRef.current);
      onTimeUp();
    }
  }, [remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const isWarning = remainingTime > 0 && remainingTime < 300;
  const timerColor = isWarning ? "text-red-600" : "text-gray-900";

  return (
    <div>
      <h3 className="flex items-center text-sm font-medium text-gray-500 mb-1">
        <IoTimeOutline className="h-5 w-5 mr-1.5" />
        Time Remaining
      </h3>
      <p className={`text-3xl font-bold ${timerColor}`}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
      {isWarning && (
        <p className="text-xs text-red-600 mt-1">Time is running out!</p>
      )}
    </div>
  );
}

export default TestTimer;