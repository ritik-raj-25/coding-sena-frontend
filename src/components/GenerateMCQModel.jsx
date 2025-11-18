import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./fields/Button";
import { FiX } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import Input from "./fields/Input";
import topicService from "../codingsena/topicService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import testService from "../codingsena/testService";

function GenerateMCQModel({ onClose, onSuccess, testId, courseId, isOpen }) {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isError, data } = useQuery({
    queryKey: ["topics", courseId],
    queryFn: () => topicService.getTopicsByCourseId(courseId),
    enabled: !!courseId,
  });

  const [selectedTopics, setSelectedTopics] = useState([]);
  const maxTopics = 10;

  const handleTopicToggle = (topicName) => {
    const name = topicName;
    setSelectedTopics((prev) => {
      if (prev.includes(name)) return prev.filter((i) => i !== name);
      if (prev.length >= maxTopics) return prev;
      return [...prev, name];
    });
  };

  const generateTestMcqs = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        numberOfMCQs: Number(data.numberOfMCQs),
        userInstructionMessage: data.userInstructionMessage || "",
        topics: selectedTopics,
      };

      const response = await testService.generateMCQsForTest(testId, payload);

      if (response?.success) {
        onSuccess();
        reset();
        toast.success(response?.message || "MCQs generated successfully!");
      } 
      else {
        onClose();
        toast.error(response?.message || "Failed to generate MCQs.");
      }
    } catch (error) {
      onClose();
      toast.error(error?.message || "Failed to generate MCQs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden ${isSubmitting ? "pointer-events-none" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(generateTestMcqs)}>

          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <IoSparklesOutline className="text-indigo-600" size={20} />
              <h3 className="text-xl font-semibold text-indigo-700">
                Generate MCQs
              </h3>
            </div>

            <button type="button" onClick={onClose}>
              <FiX
                size={24}
                className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
              />
            </button>
          </div>

          <div className="p-6 grid gap-6 overflow-y-auto max-h-[65vh]">
            <Input
              label="Number of MCQs to Generate"
              type="number"
              placeholder="e.g., 10"
              {...register("numberOfMCQs", { required: true })}
            />

            <Input
              label="Additional Instruction (optional)"
              placeholder="e.g. Academic style, Interview style, etc."
              {...register("userInstructionMessage")}
            />

            {data && (
              <div className="bg-gray-50 p-4 rounded-xl border">
                <label className="mb-3 block text-sm font-semibold text-gray-700 mb-2">
                  Select Topics (Max {maxTopics})
                </label>

                <div className="flex flex-wrap gap-2">
                  {data?.resource?.map((topic) => {
                    const tname = topic.name;
                    const checked = selectedTopics.includes(tname);
                    const disabled = !checked && selectedTopics.length >= maxTopics;

                    return (
                      <label
                        key={topic.id}
                        className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-all 
                          ${
                            checked
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                          }
                          ${disabled ? "opacity-50 pointer-events-none" : ""}
                        `}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() => handleTopicToggle(topic.name)}
                        />
                        {topic.name}
                      </label>
                    );
                  })}
                </div>

                <p className="mt-2 text-xs text-gray-600">
                  Selected: {selectedTopics.length} / {maxTopics}
                </p>

                {selectedTopics.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Please select at least one topic.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              bgColor="bg-gray-200"
              textColor="text-gray-800"
              className="rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting || isError || selectedTopics.length < 1
              }
              bgColor="bg-indigo-600"
              textColor="text-white"
              className={`rounded-lg px-6 ${
                isSubmitting ||
                isError ||
                selectedTopics.length < 1
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-indigo-700 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenerateMCQModel;