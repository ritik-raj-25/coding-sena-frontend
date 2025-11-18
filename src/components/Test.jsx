import React, { useState, useEffect } from "react";
import testService from "../codingsena/testService";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoArrowBack} from "react-icons/io5";
import { MdErrorOutline, MdOutlineInbox } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Button from "./fields/Button";
import TestCard from "./TestCard";
import { useSelector } from 'react-redux';
import enrollmentService from "../codingsena/enrollmentService";
import TestModel from "./TestModel";

import AddTestModal from "./AddTestModel"; 
import UpdateTestModal from "./UpdateTestModel";
function Test() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBatchTrainerOrAdmin, setIsBatchTrainerOrAdmin] = useState(null); // null = not known yet, true/false = known
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteingTestId, setDeletingTestId] = useState(null);

  const authSlice = useSelector((state) => state.authSlice);
  let roles = authSlice.userData?.roles?.map(role => role.roleName) || [];

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["tests", courseId, isBatchTrainerOrAdmin],
    queryFn: () => {
      if(isBatchTrainerOrAdmin) {
        return testService.getAllTestsByBatchId(courseId);
      }
      else {
        return testService.getAllActiveTestsByBatchId(courseId);
      }
    },
    enabled: isBatchTrainerOrAdmin !== null,
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchInterval: 5000, // 5 seconds
  });

  useEffect(() => {
    ;(async () => {
      if(roles.includes("ROLE_ADMIN")) {
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

  const handleDeleteTestConfirm = async () => {
    setIsDeleteModalOpen(false);
    if (!deleteingTestId) return;
    try {
      const response = await testService.deleteTest(deleteingTestId);
      if (response?.success) {
        toast.success(response?.message || "Test deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["tests", courseId] });
      } else {
        toast.error(response?.message || "Failed to delete test.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete test.");
    }
  }

  const handleDeleteTest = async (testId) => {
    setIsDeleteModalOpen(true);
    setDeletingTestId(testId);
  };

  const onAddSuccess = () => {
    setIsAddModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["tests", courseId, isBatchTrainerOrAdmin] });
  };

  const onUpdateSuccess = () => {
    setEditingTest(null);
    queryClient.invalidateQueries({ queryKey: ["tests", courseId, isBatchTrainerOrAdmin] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error?.message || "Failed to load tests.";
    toast.error(errorMessage);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <MdErrorOutline className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-red-600 text-lg text-center font-semibold">
          {errorMessage}
        </p>
        <p className="text-gray-600 text-center mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <Button
            onClick={() => navigate(`/my-courses/${courseId}/topics`)}
            className="mb-4 inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors cursor-pointer"
            bgColor="bg-indigo-100"
            textColor="text-indigo-700"
          >
            <IoArrowBack className="h-5 w-5 mr-1.5" />
            Back
          </Button>

          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Available Tests</h1>
            {isBatchTrainerOrAdmin && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add Test
              </Button>
            )}
          </div>

          {data?.resource?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.resource.map((test) => (
                <TestCard 
                  key={test.id} 
                  {...test} 
                  courseId={courseId}
                  isBatchTrainerOrAdmin={isBatchTrainerOrAdmin}
                  onEdit={() => setEditingTest(test)}
                  onDelete={() => handleDeleteTest(test.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-md border border-gray-200">
              <MdOutlineInbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Tests Found
              </h3>
              <p className="text-gray-600 text-base">
                No tests are available for this course at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddTestModal
          courseId={courseId}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={onAddSuccess}
        />
      )}

      {editingTest && (
        <UpdateTestModal
          test={editingTest}
          onClose={() => setEditingTest(null)}
          onSuccess={onUpdateSuccess}
        />
      )}

      <TestModel
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTestId(null);
        }}
        title="Delete Test Confirmation"
        onConfirm={handleDeleteTestConfirm}
      >
        <p>Are you sure you want to delete this test?</p>
        <ul className="list-disc list-inside mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md">
          <li>This is a temporary delete (soft delete).</li>
          <li>You can restore the test later if needed.</li>
          <li>Use Edit Test to restore the test.</li>
        </ul>
      </TestModel>
    </>
  );
}

export default Test;