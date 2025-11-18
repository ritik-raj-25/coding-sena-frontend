import React, { useState } from "react";
import testService from "../codingsena/testService";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import Button from "./fields/Button";
import Input from "./fields/Input";
import DropDown from "./fields/DropDown";
import { FiX } from "react-icons/fi";

const DIFFICULTY_LEVELS = [
  { label: "EASY", value: "EASY" },
  { label: "MEDIUM", value: "MEDIUM" },
  { label: "HARD", value: "HARD" },
];

function UpdateTestModal({ test, onClose, onSuccess }) {
  const [title, setTitle] = useState(test.title || "");
  const [description, setDescription] = useState(test.description || "");
  const [difficultyLevel, setDifficultyLevel] = useState(
    test.difficultyLevel || "MEDIUM"
  );
  const [totalMarks, setTotalMarks] = useState(test.totalMarks || 10);
  const [duration, setDuration] = useState(test.duration || 30);
  const [maxAttempts, setMaxAttempts] = useState(test.maxAttempts || 1);
  const [startTime, setStartTime] = useState(
    test.startTime || ""
  );
  const [endTime, setEndTime] = useState(
    test.endTime || ""
  );
  const [isActive, setIsActive] = useState(test.isActive || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime || !description) {
      toast.error("Title, Start Time, End Time, and Description are required.");
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
      isActive,
    };

    try {
      const response = await testService.updateTest(test.id, payload);
      if (response?.success) {
        onSuccess();
        toast.success(response?.message || "Test updated successfully!");
      } else {
        toast.error(response?.message || "Failed to update test.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update test.");
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
              <FaEdit className="text-indigo-600" size={22} />
              <h3 className="text-xl font-bold text-indigo-700">Update Test</h3>
            </div>
            <button type="button" onClick={onClose}>
              <FiX
                className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
                size={26}
              />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 overflow-y-auto max-h-[65vh]">
            <Input
              label="Title"
              value={title}
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
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              min="1"
            />

            <Input
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />

            <Input
              label="Max Attempts"
              type="number"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
              min="1"
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
            <DropDown
              label="Is Active"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              disabled={test.isActive}
            />

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Description
              </label>
              <textarea
                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <Button
              onClick={onClose}
              bgColor="bg-gray-200"
              textColor="text-gray-800"
              className="rounded-md hover:bg-gray-300 font-medium cursor-pointer"
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTestModal;