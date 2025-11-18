import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import testService from "../codingsena/testService";
import ReactMarkdown from "react-markdown";
import { MdOutlineEdit, MdSave, MdCancel } from "react-icons/md";
import { FiX } from "react-icons/fi";
import Button from "./fields/Button";

function ViewAndUpdateMcqsModel({ isOpen, onClose, testId }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["mcqs-admin", testId],
    queryFn: () => testService.getAllMCQsOfTestAdminAndTrainer(testId),
    enabled: !!testId && isOpen,
  });

  if (!isOpen) return null;

  const mcqs = data?.resource || [];
  const mcq = mcqs[activeIndex];

  const startEdit = () => {
    setEditing(true);
    setEditForm({
      question: mcq.question,
      optionA: mcq.optionA,
      optionB: mcq.optionB,
      optionC: mcq.optionC,
      optionD: mcq.optionD,
      correctOption: mcq.correctOption,
    });
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      setIsSaving(true);
      const response = await testService.updateMCQ(mcq.id, editForm);
      if (response?.success) {
        toast.success(response?.message || "MCQ updated successfully!");
        setEditing(false);
        refetch();
      } 
      else {
        toast.error(response?.message || "Failed to update MCQ.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update MCQ.");
    } finally {
      setIsSaving(false);
    }
  };

  const next = () => {
    if (activeIndex < mcqs.length - 1) setActiveIndex(activeIndex + 1);
    setEditing(false);
  };

  const prev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    setEditing(false);
  };

  const getOptionStyle = (optionKey) =>
    mcq.correctOption === optionKey
      ? "bg-green-100 border-green-400"
      : "bg-gray-50 border-gray-300";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-xl font-semibold text-indigo-700">
            View & Update MCQs
          </h3>

          <button type="button" onClick={onClose}>
            <FiX
              size={24}
              className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
            />
          </button>
        </div>

        <div className="p-6 grid gap-6 overflow-y-auto max-h-[65vh]">
          {!isLoading && mcqs.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="bg-white p-10 rounded-lg shadow-md border border-gray-200 text-center">
                <p className="text-gray-600 text-lg">
                  No MCQs generated. Please generate MCQs first.
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <p className="text-center text-gray-600">Loading...</p>
          )}

          {isError && (
            <p className="text-center text-red-600">
              {error?.message || "Failed to load MCQs."}
            </p>
          )}

          {mcq && (
            <div className="p-6 bg-white rounded-lg shadow-md border space-y-6">

              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-indigo-700">
                  Question {activeIndex + 1}/{mcqs.length}
                </p>

                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1 text-indigo-600 cursor-pointer hover:text-indigo-800"
                  >
                    <MdOutlineEdit size={20} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={saveEdit}
                      disabled={isSaving}
                      className={`flex items-center gap-1 cursor-pointer ${
                        isSaving ? "text-gray-400" : "text-green-600 hover:text-green-800"
                      }`}
                    >
                      <MdSave size={20} /> Save
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <MdCancel size={20} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={4}
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm({ ...editForm, question: e.target.value })
                  }
                />
              ) : (
                <pre className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap">
                  <ReactMarkdown>{mcq.question}</ReactMarkdown>
                </pre>
              )}

              <div>
                <p className="font-semibold text-gray-800 mb-2">Options:</p>

                <div className="space-y-3">
                  {["A", "B", "C", "D"].map((key) => {
                    const field = `option${key}`;
                    if (!mcq[field]) return null;

                    return (
                      <div
                        key={key}
                        className={`p-3 border rounded-md ${getOptionStyle(
                          key
                        )}`}
                      >
                        <span className="font-bold">{key}:</span>

                        {editing ? (
                          <textarea
                            className="w-full mt-2 p-2 border rounded-md"
                            rows={2}
                            value={editForm[field]}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                [field]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <pre className="inline ml-2 whitespace-pre-wrap">
                            <ReactMarkdown>{mcq[field]}</ReactMarkdown>
                          </pre>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Correct Answer
                </p>

                {editing ? (
                  <select
                    className="border p-2 rounded-md"
                    value={editForm.correctOption}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        correctOption: e.target.value,
                      })
                    }
                  >
                    {["A", "B", "C", "D"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">
                    {mcq.correctOption}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">

          <Button
            onClick={prev}
            disabled={activeIndex === 0}
            bgColor={activeIndex === 0 ? "bg-gray-300" : "bg-indigo-600"}
            textColor="text-white"
            className={`rounded-lg px-6 ${
              activeIndex === 0
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-indigo-800"
            }`}
          >
            Previous
          </Button>

          <Button
            onClick={next}
            disabled={activeIndex === mcqs.length - 1}
            bgColor={
              activeIndex === mcqs.length - 1 ? "bg-gray-300" : "bg-indigo-600"
            }
            textColor="text-white"
            className={`rounded-lg px-6 ${
              activeIndex === mcqs.length - 1
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-indigo-800"
            }`}
          >
            Next
          </Button>

        </div>
      </div>
    </div>
  );
}

export default ViewAndUpdateMcqsModel