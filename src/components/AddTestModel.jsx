import React, { useState } from "react";
import testService from "../codingsena/testService";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Button from "./fields/Button";
import Input from "./fields/Input";
import DropDown from "./fields/DropDown";

const DIFFICULTY_LEVELS = [
  { label: "EASY", value: "EASY" },
  { label: "MEDIUM", value: "MEDIUM" },
  { label: "HARD", value: "HARD" },
];

function AddTestModal({ courseId, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("MEDIUM");
  const [totalMarks, setTotalMarks] = useState(10);
  const [duration, setDuration] = useState(30);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startTime || !endTime || !description) {
      toast.error("Title, Description, Start Time, and End Time are required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      description,
      difficultyLevel,
      totalMarks: Number(totalMarks),
      duration: Number(duration),
      maxAttempts: Number(maxAttempts),
      startTime,
      endTime,
    };

    try {
      const response = await testService.addTest(courseId, payload);
      if (response?.success) {
        onSuccess();
        toast.success(response?.message || "Test added successfully!");
      } else {
        toast.error(response?.message || "Failed to add test.");
      }
    } catch (err) {
      toast.error("Failed to add test.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-5 border-b bg-white">
            <div className="flex items-center gap-2">
              <FaPlus className="text-indigo-600" size={20} />
              <h3 className="text-xl font-bold text-indigo-700">Add Test</h3>
            </div>
            <button type="button" onClick={onClose}>
              <FiX
                size={24}
                className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
              />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[65vh]">
            <Input
              label="Title"
              value={title}
              placeholder="Enter test name"
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <DropDown
              label="Difficulty Level"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              options={DIFFICULTY_LEVELS}
            />

            <Input
              label="Total Marks"
              type="number"
              min="1"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
            />

            <Input
              label="Duration (minutes)"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <Input
              label="Max Attempts"
              type="number"
              min="1"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
            />

            <Input
              label="Start Time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <Input
              label="End Time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Enter test description"
                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
            <Button
              bgColor="bg-gray-200"
              textColor="text-gray-800"
              className="rounded-md hover:bg-gray-300 font-medium cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              bgColor="bg-indigo-600"
              textColor="text-white"
              className="rounded-md hover:bg-indigo-700 font-medium cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Test"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTestModal;
