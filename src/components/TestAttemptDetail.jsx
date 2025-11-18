import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./fields/Button";
import { IoArrowBack, IoSparklesOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import testService from "../codingsena/testService";
import { toast } from "react-toastify";
import Modal from "./Modal";
import ReactMarkdown from "react-markdown";
import {
  MdCheckCircleOutline,
  MdOutlineWarningAmber,
  MdOutlineFormatListBulleted,
} from "react-icons/md";

function TestAttemptDetail() {
  const location = useLocation();
  const { mcqAttempts } = location.state || {};
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { courseId, testId, attemptId } = useParams();

  const handleGetSuggestions = async () => {
    try {
      setShowSuggestions(true);
      setIsLoadingSuggestions(true);
      const response = await testService.getAiSuggestions(attemptId);
      if (response?.success) {
        setAiSuggestion(JSON.parse(response?.resource));
        setIsModalOpen(true);
      } else {
        toast.error(
          response?.message ||
            "Failed to get AI suggestions. Please try again later."
        );
        setSuggestionsError(
          response?.message ||
            "Failed to get AI suggestions. Please try again later."
        );
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to get AI suggestions. Please try again later."
      );
      setSuggestionsError(
        error.message || "Failed to get AI suggestions. Please try again later."
      );
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const getOptionStyle = (optionKey, attempt) => {
    const isCorrect = attempt.mcqResponseDto.correctOption === optionKey;
    const isSelected = attempt.selectedOption === optionKey;
    const isWrong = isSelected && !attempt.isCorrect;

    if (isCorrect) {
      return "bg-green-100 border-green-400 text-green-900";
    }
    if (isWrong) {
      return "bg-red-100 border-red-400 text-red-900";
    }
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  const scrollToQuestion = (index) => {
    setActiveQuestionIndex(index);
    const el = document.getElementById(`question-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPaletteBtnStyle = (attempt, index) => {
    if (index === activeQuestionIndex) {
      return "bg-indigo-600 text-white font-bold";
    }
    if (attempt.isCorrect === true) {
      return "bg-green-100 hover:bg-green-200 text-green-800";
    }
    if (attempt.isCorrect === false) {
      return "bg-red-100 hover:bg-red-200 text-red-800";
    }
    return "bg-gray-100 hover:bg-gray-200 text-gray-700";
  };

  if (!mcqAttempts || mcqAttempts.length === 0) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Button
            onClick={() => navigate(`/my-courses/${courseId}/tests/${testId}`)}
            className="mb-4 cursor-pointer inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors"
            bgColor="bg-indigo-100"
            textColor="text-indigo-700"
          >
            <IoArrowBack className="h-5 w-5 mr-1.5" />
            Back
          </Button>
          <div className="bg-white p-10 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-600 text-lg">No attempt details found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowSuggestions(false);
        }}
        title="AI Suggestions"
      >
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <IoSparklesOutline className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0" />
              <h2 className="text-xl font-bold text-gray-900">
                Overall Analysis
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <ReactMarkdown>{aiSuggestion?.overallAnalysis}</ReactMarkdown>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <MdCheckCircleOutline className="h-6 w-6 text-green-700 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-green-800">
                  Strengths
                </h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-green-700 text-sm">
                {aiSuggestion?.strengths.map((s, i) => (
                  <li key={i}>
                    <ReactMarkdown>{s}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center mb-2">
                <MdOutlineWarningAmber className="h-6 w-6 text-red-700 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-red-800">
                  Weaknesses
                </h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-red-700 text-sm">
                {aiSuggestion?.weaknesses.map((w, i) => (
                  <li key={i}>
                    <ReactMarkdown>{w}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <MdOutlineFormatListBulleted className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
              <h3 className="text-xl font-bold text-blue-800">
                Suggestions for Improvement
              </h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {aiSuggestion?.suggestions.map((s, i) => (
                <li key={i}>
                  <ReactMarkdown>{s}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() =>
                navigate(`/my-courses/${courseId}/tests/${testId}`)
              }
              className="mb-4 cursor-pointer inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors"
              bgColor="bg-indigo-100"
              textColor="text-indigo-700"
            >
              <IoArrowBack className="h-5 w-5 mr-1.5" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Test Attempt Details
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">
                    Questions
                  </h3>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {mcqAttempts.map((attempt, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToQuestion(index)}
                        className={`h-12 w-full rounded-md font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer ${getPaletteBtnStyle(
                          attempt,
                          index
                        )}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Want to improve?
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get AI-powered suggestions for the questions you got wrong.
                  </p>
                  <Button
                    onClick={handleGetSuggestions}
                    bgColor="bg-indigo-600"
                    textColor="text-white"
                    className="w-full hover:bg-indigo-700 font-bold rounded-lg cursor-pointer"
                  >
                    Get AI Suggestions
                  </Button>
                  {showSuggestions && (
                    <div className="mt-4 p-3 bg-indigo-50 text-indigo-800 text-left text-sm rounded-lg">
                      <IoSparklesOutline className="h-5 w-5 inline mr-2" />
                      {isLoadingSuggestions
                        ? "Loading suggestions..."
                        : suggestionsError
                        ? suggestionsError
                        : aiSuggestion
                        ? "Suggestions loaded. Please check the modal."
                        : "No suggestions available at the moment."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
              {mcqAttempts.map((attempt, index) => {
                const options = [
                  { key: "A", text: attempt.mcqResponseDto.optionA },
                  { key: "B", text: attempt.mcqResponseDto.optionB },
                  { key: "C", text: attempt.mcqResponseDto.optionC },
                  { key: "D", text: attempt.mcqResponseDto.optionD },
                ].filter((opt) => opt.text);

                return (
                  <div
                    key={index}
                    id={`question-${index}`}
                    className="p-6 bg-white rounded-lg shadow-md border border-gray-200 scroll-mt-24"
                  >
                    <p className="text-xl font-bold mb-3 text-indigo-700">
                      Question {index + 1}
                    </p>

                    <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-x-auto whitespace-pre-wrap font-sans text-base mb-4">
                      <ReactMarkdown>{attempt.mcqResponseDto.question}</ReactMarkdown>
                    </pre>

                    <p className="mt-4 mb-2 font-semibold text-gray-800">
                      Options:
                    </p>
                    <ul className="space-y-3">
                      {options.map((option) => (
                        <li
                          key={option.key}
                          className={`p-3 border rounded-md ${getOptionStyle(
                            option.key,
                            attempt
                          )}`}
                        >
                          <span className="font-bold">{option.key}:</span>
                          <pre className="inline ml-2 whitespace-pre-wrap font-sans">
                            <ReactMarkdown>{option.text}</ReactMarkdown>
                          </pre>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Your Answer
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {attempt.selectedOption || "Not Answered"}
                        </p>
                      </div>
                      <div>
                        <p className="block text-sm font-medium text-gray-500">
                          Correct Answer
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {attempt.mcqResponseDto.correctOption}
                        </p>
                      </div>
                      <div>
                        <p className="block text-sm font-medium text-gray-500">
                          Result
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            attempt.isCorrect === null
                              ? "text-gray-600"
                              : attempt.isCorrect
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {attempt.isCorrect === null
                            ? "Not Answered"
                            : attempt.isCorrect
                            ? "Correct"
                            : "Incorrect"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TestAttemptDetail;