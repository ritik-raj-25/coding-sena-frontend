import React, { useEffect, useState } from "react";
import testService from "../codingsena/testService";
import { useParams, useNavigate } from "react-router-dom";
import Button from "./fields/Button";
import TestModel from "./TestModel";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import enrollmentService from "../codingsena/enrollmentService";
import { useSelector } from "react-redux";
import { IoSparklesOutline } from "react-icons/io5";
import GenerateMCQModel from "./GenerateMCQModel";
import ViewAndUpdateMcqsModel from "./ViewAndUpdateMcqsModel";
import TestReportModel from "./TestReportModel";
import {
  IoArrowBack,
  IoStatsChart,
  IoTimeOutline,
  IoInformationCircleOutline,
  IoHourglassOutline,
} from "react-icons/io5";
import {
  MdOutlineVerified,
  MdErrorOutline,
  MdFormatListNumbered,
} from "react-icons/md";
import { set } from "react-hook-form";

// Helper component needed only within this file
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div className="ml-3">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  </div>
);

function TestDetail() {
  const { courseId, testId } = useParams();
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [isBatchTrainerOrAdmin, setIsBatchTrainerOrAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateMCQModelOpen, setIsGenerateMCQModelOpen] = useState(false);
  const [isManageMCQModelOpen, setIsManageMCQModelOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const navigate = useNavigate();

  const authSlice = useSelector((state) => state.authSlice);
  let roles = authSlice.userData?.roles?.map((role) => role.roleName) || [];

  const {
    isLoading,
    isError,
    error,
    data: testData,
  } = useQuery({
    queryKey: ["testDetail", testId],
    queryFn: () => testService.getTestById(testId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const {
    isLoading: isAttemptsLoading,
    data: attemptsData,
    isError: isAttemptsError,
    error: attemptsError,
  } = useQuery({
    queryKey: ["attempts", testId],
    queryFn: () => testService.getAllAttemptsByTestId(testId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    (async () => {
      try {
        const remainingAttempt = await testService.getRemainingAttemptsByTestId(
          testId
        );
        if (remainingAttempt?.success) {
          setRemainingAttempts(remainingAttempt.resource);
        } else {
          toast.error(
            remainingAttempt?.message || "Failed to fetch remaining attempts."
          );
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch remaining attempts.");
      }
    })();
  }, [testId]);

  useEffect(() => {
    (async () => {
      if (roles.includes("ROLE_ADMIN")) {
        setIsBatchTrainerOrAdmin(true);
        return;
      }
      try {
        const response = await enrollmentService.isBatchTrainer(courseId);
        setIsBatchTrainerOrAdmin(response?.success ? response.resource : false);
      } catch (error) {
        setIsBatchTrainerOrAdmin(false);
      }
    })();
  }, [courseId, roles]);

  function parseLocalDateTime(dateString) {
    if (!dateString) return null;

    const [date, time] = dateString.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute, second] = time.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  }

  const now = new Date();
  const startTime = parseLocalDateTime(testData?.resource?.startTime);
  const endTime = parseLocalDateTime(testData?.resource?.endTime);
  const isTestActive = now >= startTime && now <= endTime;

  const isStartDisabled =
    remainingAttempts === 0 || !isTestActive || remainingAttempts === null;
  let disabledMessage = "";
  if (remainingAttempts === 0) {
    disabledMessage = "No attempts remaining.";
  } else if (now < startTime) {
    disabledMessage = `Test starts at: ${startTime.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } else if (now > endTime) {
    disabledMessage = "Test has expired.";
  }

  const startTest = () => {
    if (isStartDisabled) {
      toast.error(disabledMessage || "You cannot start this test.");
      return;
    }
    setIsModalOpen(true);
  };

  const generateMcqs = () => {
    setIsGenerateMCQModelOpen(true);
  };

  const handleMcqGenerationSuccess = () => {
    setIsGenerateMCQModelOpen(false);
    setIsManageMCQModelOpen(true);
  }

  const viewAndUpdateMcqs = () => {
    setIsManageMCQModelOpen(true);
  };

  const viewTestReport = async () => {
    try {
      const response = await testService.getTestReport(testId);
      if(response.success) {
        if(response.resource.length === 0) {
          toast.info("No attempts yet. Report cannot be generated.");
          setIsReportModalOpen(false);
          return;
        }
        setIsReportModalOpen(true);
        setReportData(response.resource);    
      }
      else {
        toast.error(response.message || "Failed to fetch test report.");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to fetch test report.");
    }
  };

  const downloadTestReport = () => {
    let csv = "User Email,Score\n";
    reportData.forEach((r) => {
      csv += `${r.userEmail},${r.score}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `test_report_${testId}.csv`;
    a.click();

    URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully.");
    setIsReportModalOpen(false);
  };

  const handleStartConfirm = () => {
    setIsModalOpen(false);
    navigate(`/my-courses/${courseId}/tests/${testId}/start`, {
      state: { testData },
    });
  };

  const viewAttemptDetails = (attemptId, mcqAttempts) => {
    navigate(`/my-courses/${courseId}/tests/${testId}/attempts/${attemptId}`, {
      state: { mcqAttempts },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    toast.error(error.message || "Failed to load test details.");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <MdErrorOutline className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-red-600 text-lg text-center font-semibold">
          {error.message || "Failed to load test details."}
        </p>
        <p className="text-gray-600 text-center mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <TestReportModel
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        data={reportData}
        onDownload={downloadTestReport}
      />
      <GenerateMCQModel
        isOpen={isGenerateMCQModelOpen}
        onClose={() => setIsGenerateMCQModelOpen(false)}
        testId={testId}
        courseId={courseId}
        onSuccess={handleMcqGenerationSuccess}
      />
      <ViewAndUpdateMcqsModel
        isOpen={isManageMCQModelOpen}
        onClose={() => setIsManageMCQModelOpen(false)}
        testId={testId}
      />
      <TestModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartConfirm}
        title="Start Test Confirmation"
      >
        <p>Are you sure you want to start this test?</p>
        <ul className="list-disc list-inside mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md">
          <li>The timer will begin immediately.</li>
          <li>You cannot pause the test once started.</li>
          <li>You can't start another attempt once one is in progress.</li>
          <li>Test will auto-submit when time is up.</li>
          <li>Don't refresh the page.</li>
          <li>
            Refreshing will prevent resuming the test or starting a new attempt
            until auto-submission.
          </li>
          <li>Ensure you have a stable internet connection.</li>
        </ul>
      </TestModel>

      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigate(`/my-courses/${courseId}/tests`)}
            className="mb-4 inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors cursor-pointer"
            bgColor="bg-indigo-100"
            textColor="text-indigo-700"
          >
            <IoArrowBack className="h-5 w-5 mr-1.5" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {testData?.resource?.title}
          </h1>
          <p className="text-gray-600 mb-6 text-base">
            {testData?.resource?.description}
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-5">
              <DetailItem
                icon={<IoStatsChart className="h-6 w-6 text-indigo-500" />}
                label="Difficulty"
                value={testData?.resource?.difficultyLevel}
              />
              <DetailItem
                icon={<IoTimeOutline className="h-6 w-6 text-blue-500" />}
                label="Duration"
                value={`${testData?.resource?.duration} minutes`}
              />
              <DetailItem
                icon={<MdOutlineVerified className="h-6 w-6 text-green-500" />}
                label="Total Marks"
                value={testData?.resource?.totalMarks}
              />
              <DetailItem
                icon={
                  <MdFormatListNumbered className="h-6 w-6 text-yellow-600" />
                }
                label="Max Attempts"
                value={testData?.resource?.maxAttempts}
              />
              <DetailItem
                icon={
                  <IoHourglassOutline className="h-6 w-6 text-indigo-500" />
                }
                label="Remaining"
                value={
                  remainingAttempts !== null ? remainingAttempts : "Loading..."
                }
              />
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <IoInformationCircleOutline className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-blue-800">
                Instructions
              </h3>
            </div>
            <ul className="list-disc list-inside mt-2 text-blue-700 text-sm space-y-1 pl-9">
              <li>This test contains multiple-choice questions.</li>
              <li>The timer will start as soon as you begin.</li>
              <li>Do not refresh the page during the test.</li>
              <li>
                Refreshing will prevent resuming the test or starting a new
                attempt until auto-submission.
              </li>
              <li>Your answers will be auto-submitted if the time runs out.</li>
              <li>Ensure a stable internet connection throughout the test.</li>
            </ul>
          </div>

          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Button
                  onClick={startTest}
                  className={`w-full md:w-auto text-lg ${
                    isStartDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-800 cursor-pointer transition-colors"
                  } text-white font-bold py-3 px-8 rounded-lg`}
                  disabled={isStartDisabled}
                >
                  Start Test
                </Button>
                {isStartDisabled && disabledMessage && (
                  <p className="text-red-500 text-sm mt-2">{disabledMessage}</p>
                )}
              </div>
              {isBatchTrainerOrAdmin && (
                <Button
                  bgColor="bg-green-600"
                  textColor="text-white"
                  className="w-full md:w-auto text-lg hover:bg-green-800 font-bold py-3 px-8 rounded-lg cursor-pointer transition-colors"
                  onClick={generateMcqs}
                >
                  <div className="flex items-center justify-center">
                    <IoSparklesOutline className="h-7 w-7 inline mr-2 font-bold" />
                    Generate MCQs
                  </div>
                </Button>
              )}
              {isBatchTrainerOrAdmin && (
                <Button
                  bgColor="bg-purple-600"
                  textColor="text-white"
                  className="w-full md:w-auto text-lg hover:bg-purple-800 font-bold py-3 px-8 rounded-lg cursor-pointer transition-colors"
                  onClick={viewAndUpdateMcqs}
                >
                  View & Manage MCQs
                </Button>
              )}

              {isBatchTrainerOrAdmin && (
                <Button
                  bgColor="bg-indigo-600"
                  textColor="text-white"
                  className="w-full md:w-auto text-lg hover:bg-indigo-800 font-bold py-3 px-8 rounded-lg cursor-pointer transition-colors"
                  onClick={viewTestReport}
                >
                  View Test Reports
                </Button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Previous Attempts</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {isAttemptsLoading && (
                <div className="flex justify-center p-10">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {isAttemptsError && (
                <p className="text-red-500 p-10">{attemptsError.message}</p>
              )}

              {attemptsData?.resource?.length == 0 && !isAttemptsLoading && (
                <p className="text-gray-600 p-10">
                  You have not attempted this test yet.
                </p>
              )}

              {attemptsData?.resource?.map((attempt) => (
                <div
                  key={attempt.id}
                  className={`flex flex-col md:flex-row border-b border-b-gray-200 justify-between items-start md:items-center p-5 ${
                    attempt.isTestAttemptTempered
                      ? "bg-red-50 border-l-4 border-red-400"
                      : ""
                  }`}
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <p className="font-bold text-lg text-indigo-700">
                      Attempt {attempt.attemptNumber}
                    </p>
                    <p className="text-lg font-bold mt-1">
                      Score:{" "}
                      <span
                        className={`text-gray-900 ${
                          attempt.isTestAttemptTempered
                            ? "line-through decoration-red-500"
                            : ""
                        }`}
                      >
                        {attempt.score} / {attempt.totalMarks}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted:{" "}
                      {parseLocalDateTime(attempt.submittedAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>

                  {attempt.isTestAttemptTempered && (
                    <div className="flex items-center text-red-700 mb-4 md:mb-0 md:mx-4">
                      <MdErrorOutline className="h-5 w-5 mr-1.5 flex-shrink-0" />
                      <p className="text-sm font-semibold">
                        Irregular Activity Detected
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      viewAttemptDetails(attempt.id, attempt.mcqAttempts)
                    }
                    className="inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors cursor-pointer"
                    bgColor="bg-indigo-100"
                    textColor="text-indigo-700"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TestDetail;