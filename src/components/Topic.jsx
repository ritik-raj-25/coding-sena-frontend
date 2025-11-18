import React, { useState, useCallback, use } from "react";
import topicService from "../codingsena/topicService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { FaAngleRight, FaRegFileAlt, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import studyMaterialService from "../codingsena/studyMaterialService";
import StudyMaterial from "./StudyMaterial";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "./fields/Button";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import enrollmentService from "../codingsena/enrollmentService";
import AddTopicForm from "./AddTopicForm";
import UpdateTopicForm from "./UpdateTopicFrom";
import AddMaterialForm from "./AddMaterialForm";
import UpdateMaterialForm from "./UpdateMaterialForm";
import TestModel from "./TestModel"; // will be uses as normal modal

function Topic() {
  const { courseId } = useParams();
  const [isStudyMaterialVisible, setIsStudyMaterialVisible] = useState({});
  const [studyMaterials, setStudyMaterials] = useState({});
  const [loadingMaterials, setLoadingMaterials] = useState({});
  const [isBatchTrainerOrAdmin, setIsBatchTrainerOrAdmin] = useState(false);
  const [isDeleteTopicModalOpen, setIsDeleteTopicModalOpen] = useState(false);
  const [isDeleteStudyMaterialModalOpen, setIsDeleteStudyMaterialModalOpen] = useState(false);
  
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editTopicId, setEditTopicId] = useState(null);
  const [addingMaterialToTopicId, setAddingMaterialToTopicId] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [deleteTopicId, setDeleteTopicId] = useState(null);
  const [deleteMaterialId, setDeleteMaterialId] = useState(null);
  const [deleteMaterialIdTopicId, setDeleteMaterialIdTopicId] = useState(null);
  const [editTopicNameModalOpen, setEditTopicNameModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const authSlice = useSelector((state) => state.authSlice);
  let roles = authSlice.userData?.roles?.map(role => role.roleName) || [];

  const {
    isLoading,
    isError,
    error,
    data: courseData,
  } = useQuery({
    queryKey: ["topics", courseId],
    queryFn: () => topicService.getTopicsByCourseId(courseId),
    staleTime: 5 * 60 * 1000,
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

  const topics = courseData?.resource || [];

  const fetchMaterials = useCallback(async (topicId) => {
    setLoadingMaterials((prev) => ({ ...prev, [topicId]: true }));
    try {
      const response = await studyMaterialService.getStudyMaterialsByBatchIdAndTopicId(courseId, topicId);
      if (response?.success) {
        setStudyMaterials((prev) => ({
          ...prev,
          [topicId]: response.resource,
        }));
      } 
      else {
        toast.error(response?.message || "Failed to load materials.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load materials.");
    } finally {
      setLoadingMaterials((prev) => ({ ...prev, [topicId]: false }));
    }
  }, [courseId]);

  const listStudyMaterial = async (topicId) => {
    setIsStudyMaterialVisible((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));

    if (!studyMaterials[topicId]) {
      await fetchMaterials(topicId);
    }
  };

  const handleDeleteTopicConfirm = async () => {
    setIsDeleteTopicModalOpen(false);
    try {
      const response = await topicService.deleteTopic(deleteTopicId, courseId);
      if (response?.success) {
        toast.success(response?.message || "Topic deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["topics", courseId] });
      } 
      else {
        toast.error(response?.message || "Failed to delete topic.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete topic.");
    }
  }

  const handleDeleteTopic = (topicId) => {
    setIsDeleteTopicModalOpen(true);
    setDeleteTopicId(topicId);
  };

  const handleDeleteStudyMaterialConfirm = async () => {
    setIsDeleteStudyMaterialModalOpen(false);
    try {
      const response = await studyMaterialService.deleteStudyMaterial(deleteMaterialId, courseId);
      if (response?.success) {
        toast.success(response?.message || "Material deleted successfully.");
        await fetchMaterials(deleteMaterialIdTopicId);
      } 
      else {
        toast.error(response?.message || "Failed to delete material.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete material.");
    }
  };

  const handleDeleteStudyMaterial = (materialId, topicId) => {
    setIsDeleteStudyMaterialModalOpen(true);
    setDeleteMaterialId(materialId);
    setDeleteMaterialIdTopicId(topicId);
  };

  const handleEditTopicConfirm = () => {
    setEditTopicNameModalOpen(false);
    setEditingTopicId(editTopicId);
  };

  const handleEditTopic = (topicId) => {
    setEditTopicId(topicId);
    setIsAddingTopic(false);
    setEditTopicNameModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    toast.error(error?.message || "Failed to load topics.");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">
          Failed to load topics. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
    <TestModel
      isOpen={isDeleteTopicModalOpen}
      onClose={() => setIsDeleteTopicModalOpen(false)}
      title={"Delete Topic Confirmation"}
      onConfirm={handleDeleteTopicConfirm}
    >
      <p>Are you sure you want to delete this topic?</p>
      <ul className="list-disc list-inside mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md">
        <li>This action cannot be undone.</li>
        <li>Related study materials will also be deleted.</li>
      </ul>
    </TestModel>

    <TestModel
      isOpen={editTopicNameModalOpen}
      onClose={() => setEditTopicNameModalOpen(false)}
      title={"Edit Topic Name Confirmation"}
      onConfirm={handleEditTopicConfirm}
    >
      <p>Are you sure you want to edit this topic name?</p>
      <ul className="list-disc list-inside mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md">
        <li>Changing the topic name will hide its study materials.</li>
        <li>Reverting to the original name will restore them.</li>
        <li>Keeping the new name means you must re-add the materials.</li>
      </ul>
    </TestModel>

    <TestModel
      isOpen={isDeleteStudyMaterialModalOpen}
      onClose={() => setIsDeleteStudyMaterialModalOpen(false)}
      title={"Delete Study Material Confirmation"}
      onConfirm={handleDeleteStudyMaterialConfirm}
    >
      <p>Are you sure you want to delete this study material?</p>
      <ul className="list-disc list-inside mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md">
        <li>This action cannot be undone.</li>
      </ul>
    </TestModel>

    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => navigate(`${roles.includes("ROLE_ADMIN") ? '/courses' : '/dashboard/my-courses'}`)}
          className="mb-4 inline-flex items-center text-sm font-semibold hover:bg-indigo-200 transition-colors cursor-pointer"
          bgColor="bg-indigo-100"
          textColor="text-indigo-700"
          aria-label="Go back"
        >
          <IoArrowBack className="h-5 w-5 mr-1.5" />
          Back
        </Button>
        <div className="mb-6 border-b pb-4 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Course Topics
          </h1>
          {isBatchTrainerOrAdmin && !isAddingTopic && (
            <Button
              onClick={() => {
                setIsAddingTopic(true);
                setEditingTopicId(null);
              }}
              className="inline-flex items-center cursor-pointer hover:bg-blue-800 transition-colors"
            >
              <FaPlus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          )}
        </div>

        {isAddingTopic && (
          <AddTopicForm
            courseId={courseId}
            onSuccess={() => setIsAddingTopic(false)}
            onCancel={() => setIsAddingTopic(false)}
          />
        )}

        <div className="space-y-4">
          {topics.map((topic, index) => {
            
            if (editingTopicId === editTopicId && editingTopicId === topic.id) {
              return (
                <UpdateTopicForm
                  key={topic.id}
                  topic={topic}
                  onSuccess={() => setEditingTopicId(null)}
                  onCancel={() => setEditingTopicId(null)}
                  courseId={courseId}
                />
              );
            }

            const isVisible = !!isStudyMaterialVisible[topic.id];
            return (
              <div
                key={topic.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
              >
                <div
                  onClick={() => listStudyMaterial(topic.id)}
                  className="p-4 sm:p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors duration-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 font-bold rounded-full flex-shrink-0">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 flex-grow">
                    {topic.name}
                  </h2>
                  {isBatchTrainerOrAdmin && (
                    <div className="flex items-center gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTopic(topic.id);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors transition-transform hover:scale-110 cursor-pointer"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTopic(topic.id);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer hover:scale-110 transition-transform"
                        aria-label="Delete topic"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  )}
                  <div
                    className={`text-gray-500 transform transition-transform duration-150 ${
                      isVisible ? "rotate-90" : ""
                    }`}
                  >
                    <FaAngleRight size={20} />
                  </div>
                </div>
                
                <div
                  className={`transition-[max-height] duration-150 ease-in-out overflow-hidden ${
                    isVisible ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 border-t border-gray-200">
                    {loadingMaterials[topic.id] ? (
                      <div className="flex justify-center p-6">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : studyMaterials[topic.id]?.length > 0 ? (
                      <div className="py-4 space-y-3">
                        {isBatchTrainerOrAdmin && addingMaterialToTopicId !== topic.id && (
                          <div className="py-2 text-right">
                            <Button
                              onClick={() => {
                                setAddingMaterialToTopicId(topic.id);
                                setEditingMaterialId(null);
                              }}
                              className="inline-flex items-center hover:bg-blue-800 transition-colors cursor-pointer"
                            >
                              <FaPlus className="h-4 w-4 mr-2" />
                              Add Study Material
                            </Button>
                          </div>
                        )}

                        {addingMaterialToTopicId === topic.id && (
                          <AddMaterialForm
                            courseId={courseId}
                            topicId={topic.id}
                            onSuccess={async () => {
                              setAddingMaterialToTopicId(null);
                              await fetchMaterials(topic.id);
                            }}
                            onCancel={() => setAddingMaterialToTopicId(null)}
                          />
                        )}

                        {studyMaterials[topic.id]?.map((material) => {
                          if (editingMaterialId === material.id) {
                            return (
                              <UpdateMaterialForm
                                key={material.id}
                                material={material}
                                onSuccess={async () => {
                                  setEditingMaterialId(null);
                                  await fetchMaterials(topic.id);
                                }}
                                onCancel={() => setEditingMaterialId(null)}
                              />
                            );
                          }

                          return (
                            <div key={material.id} className="flex items-center gap-2 group">
                              <div className="flex-grow">
                                <StudyMaterial {...material} />
                              </div>
                              {isBatchTrainerOrAdmin && (
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingMaterialId(material.id);
                                      setAddingMaterialToTopicId(null);
                                    }}
                                    className="p-1 text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform transition-colors cursor-pointer"
                                  >
                                    <FaEdit size={20} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudyMaterial(material.id, topic.id)}
                                    className="p-1 text-red-600 hover:text-red-800 hover:scale-110 transition-transform transition-colors cursor-pointer"
                                  >
                                    <FaTrash size={20} />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-gray-600">
                          No study materials available for this topic.
                        </p>
                        {isBatchTrainerOrAdmin && (
                          addingMaterialToTopicId === topic.id ? (
                            <AddMaterialForm
                              courseId={courseId}
                              topicId={topic.id}
                              onSuccess={async () => {
                                setAddingMaterialToTopicId(null);
                                await fetchMaterials(topic.id);
                              }}
                              onCancel={() => setAddingMaterialToTopicId(null)}
                            />
                          ) : (
                            <div className="mt-4">
                              <Button
                                onClick={() => {
                                  setAddingMaterialToTopicId(topic.id);
                                  setEditingMaterialId(null);
                                }}
                                className="inline-flex items-center cursor-pointer hover:bg-blue-800"
                              >
                                <FaPlus className="h-4 w-4 mr-2" />
                                Add First Material
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Link to={`/my-courses/${courseId}/tests`} className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 z-20">
          <FaRegFileAlt size={20} />
          Batch Tests
        </Link>
      </div>
    </div>
    </>
  );
}

export default Topic;