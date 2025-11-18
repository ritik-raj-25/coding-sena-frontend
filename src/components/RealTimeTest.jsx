import React, { useEffect, useState } from 'react';
import testService from '../codingsena/testService';
import MCQ from './MCQ';
import TestTimer from './TestTimer';
import TestModel from './TestModel';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useBlocker, useLocation } from 'react-router-dom';
import Button from './fields/Button';
import { toast } from 'react-toastify';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

function RealTimeTest() {
  const { courseId, testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // for test start loading
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testDuration, setTestDuration] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState({}); // {mcqId: selectedOption}
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // {mcqIndex: true/false}

  const testData = location.state?.testData;
  const blocker = useBlocker(!isTestSubmitted);

  const {
    data: startTestData,
    mutate,
  } = useMutation({
    mutationFn: () => testService.startTest(testId),
    onSuccess: () => {
      refetch();
      setIsLoading(false);
    },
    onError: (err) => {
      setIsLoading(false);
      setIsSubmitModalOpen(false);
      setIsTestSubmitted(true); // to allow navigation only after error. Test will be auto-submitted by backend on timeout.
      toast.error(err.message || 'Failed to start test. Please try again.', {
        onClose: () => {
          if(blocker.state === 'blocked') {
            blocker.reset();
          }
          navigate(`/my-courses/${courseId}/tests/${testId}`, { replace: true });
        },
      });
    },
  });

  const {
    isLoading: isLoadingMCQs,
    isError: isErrorMCQs,
    data: mcqsData,
    error: mcqsError,
    refetch,
  } = useQuery({
    queryKey: ['mcqs', testId],
    queryFn: () => testService.getMCQsByTestId(testId),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { mutate: saveMcqMutate } = useMutation({
    mutationFn: ({ attemptId, mcqId, selectedOption }) =>
      testService.saveMCQAnswer(attemptId, mcqId, { selectedOption }),
    onError: (err) => {
      toast.error(err.message || 'Failed to save answer.');
    },
  });

  const { mutate: submitTestMutate } = useMutation({
    mutationFn: () => testService.submitTestAttempt(startTestData?.resource?.id),
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(response?.message || 'Test submitted successfully!', {
          onClose: () => {
            navigate(`/my-courses/${courseId}/tests/${testId}`, { replace: true });
          },
        });
      } else {
        toast.error(response?.message || 'Failed to submit test.');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit test.');
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (!isTestSubmitted && testData) {
      setTestDuration(testData?.resource?.duration);
      mutate();
    } 
    else {
      navigate(`/my-courses/${courseId}/tests/${testId}`, { replace: true });
    }
  }, [mutate]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setIsSubmitModalOpen(true);
    }
  }, [blocker]);

  const handleSelectAnswer = (mcqId, selectedOption) => {
    setMcqAnswers(prev => ({...prev, [mcqId]: selectedOption}))
    setAnsweredQuestions(prev => ({...prev, [currentQuestionIndex]: true}));
    saveMcqMutate({
      attemptId: startTestData?.resource?.id,
      mcqId,
      selectedOption,
    });
  };

  const goToNext = () => {
    if (currentQuestionIndex < mcqsData?.resource?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  
  const handleJumpTo = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    setIsTestSubmitted(true);
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    submitTestMutate();
  };

  const handleCancelSubmit = () => {
    setIsSubmitModalOpen(false);

    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-gray-700">Starting Test...</p>
      </div>
    );
  }

  const currentMCQ = mcqsData?.resource?.[currentQuestionIndex];
  const totalQuestions = mcqsData?.resource?.length || 0;

  const getPaletteBtnStyle = (index) => {
    if (index === currentQuestionIndex) {
      return 'bg-indigo-600 text-white font-bold'; 
    }
    if (answeredQuestions[index]) {
      return 'bg-green-600 text-white font-bold';
    }
    return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  };

  return (
    <>
      {isTestSubmitted && (<div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm'></div>)}
      <TestModel
        isOpen={isSubmitModalOpen}
        onClose={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
        title="Submit Test?"
      >
        <p>Are you sure you want to submit your test?</p>
        <p className="text-sm text-gray-600">
          You will not be able to change your answers after this.
        </p>
        {blocker.state === 'blocked' && (
          <p className="text-sm text-yellow-700 mt-2">
            Note: You must submit the test to navigate away.
          </p>
        )}
      </TestModel>

      <div className={`p-4 bg-gray-50 md:p-10 min-h-screen ${isTestSubmitted ? 'pointer-events-none' : ''}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                <TestTimer
                  durationInMinutes={testDuration}
                  onTimeUp={handleConfirmSubmit}
                />
              </div>

              {totalQuestions > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Questions</h3>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {Array.from(Array(totalQuestions).keys()).map((index) => (
                      <button
                        key={index}
                        onClick={() => handleJumpTo(index)}
                        className={`h-12 w-full rounded-md font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer ${getPaletteBtnStyle(
                          index
                        )}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Finish Test</h3>
                <p className="text-sm text-gray-600 mb-4">When you are finished, submit your test here.</p>
                <Button
                onClick={handleSubmit}
                disabled={isTestSubmitted}
                className={`w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 ${isTestSubmitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {
                    isTestSubmitted ? 'Submitting...' : 'Submit Test Now'
                  }
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 md:p-8">
              {isLoadingMCQs ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="ml-4 text-gray-700">Loading Questions...</p>
                </div>
              ) : isErrorMCQs ? (
                <div>Error loading MCQs: {mcqsError.message}</div>
              ) : totalQuestions > 0 && currentMCQ ? (
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-4">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                  <MCQ
                    key={currentMCQ.id}
                    {...currentMCQ}
                    attemptId={startTestData?.resource?.id}
                    onSelectAnswer={handleSelectAnswer}
                    selectedOption={mcqAnswers[currentMCQ.id]}
                  />
                </div>
              ) : (
                <div>No MCQs found for this test.</div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <Button
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors disabled:opacity-50 ${currentQuestionIndex === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  bgColor="bg-indigo-100"
                  textColor="text-indigo-700"
                >
                  <IoChevronBack className="h-5 w-5 mr-1" />
                  Previous
                </Button>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <span className="text-sm font-medium text-gray-500">
                    This is the last question.
                  </span>
                ) : (
                  <Button
                    onClick={goToNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className={`inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors disabled:opacity-50 ${currentQuestionIndex === totalQuestions - 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    bgColor="bg-indigo-100"
                    textColor="text-indigo-700"
                  >
                    Next
                    <IoChevronForward className="h-5 w-5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RealTimeTest;