import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "./fields/Input";
import Button from "./fields/Button";
import courseService from "../codingsena/courseService";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import DropDown from './fields/DropDown';
import { QueryClient } from "@tanstack/react-query";

const BatchValidityOptions = [
  { value: "SIX_MONTHS", label: "Six Months" },
  { value: "ONE_YEAR", label: "One Year" },
  { value: "TWO_YEAR", label: "Two Years" },
  { value: "LIFE_TIME", label: "Lifetime" },
];

function AddAndUpdateCourse({
    courseData,
    onSuccess,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      price: courseData?.price || 0,
      discount: courseData?.discount || 0,
      batchName: courseData?.batchName || '',
      validity: courseData?.validity || 'SIX_MONTHS',
      startDate: courseData?.startDate || '',
      endDate: courseData?.endDate || '',
    }
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  const [coverPicPreview, setCoverPicPreview] = useState(courseData?.coverPicUrl);
  const [curriculumPreview, setCurriculumPreview] = useState(courseData?.curriculumUrl);

  const queryClient = new QueryClient();

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPicPreview(URL.createObjectURL(file));
    } else {
      setCoverPicPreview(courseData?.coverPicUrl || null);
    }
  };

  const handleCurriculumChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurriculumPreview(URL.createObjectURL(file));
    } else {
      setCurriculumPreview(courseData?.curriculumUrl || null);
    }
  };

  const {mutate: createCourseMutation} = useMutation({
    mutationFn: (data) => {
        return courseService.createCourse(data); 
    },
    onSuccess: (response) => {
        if(response?.success) {
            setSuccess(response.message || "Course added successfully!");
            queryClient.invalidateQueries(["courses", courseFilter, sortDir, pageNumber]);
            navigate(`/courses/${response.resource.id}`);
            toast.success(response.message || "Course added successfully!");
            reset();
        }
        else {
            setError(response.message || "Course creation failed. Please try again.");
            toast.error(response.message || "Course creation failed. Please try again.");
        }
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsLoading(false);
    },
    onError: (err) => {
        setError(err.message || "Course creation failed. Please try again.");
        toast.error(err.message || "Course creation failed. Please try again.");
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsLoading(false);
    },
  });

  const {mutate: updateCourseMutation} = useMutation({
    mutationFn: (data) => {
        return courseService.updateCourse(courseData.id, data);
    },
    onSuccess: (response) => {
        if(response?.success) {
            setSuccess(response.message || "Course updated successfully!");
            reset();
            queryClient.invalidateQueries(["courses", courseFilter, sortDir, pageNumber]);
            onSuccess();
            toast.success(response.message || "Course updated successfully!");
        }
        else {
            setError(response.message || "Course update failed. Please try again.");
            toast.error(response.message || "Course update failed. Please try again.");
        }
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsLoading(false);
    },
    onError: (err) => {
        setError(err.message || "Course update failed. Please try again.");
        toast.error(err.message || "Course update failed. Please try again.");
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsLoading(false);
    },
  });

  const handleFormSubmit = (data) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    if (courseData && courseData.id) {
      updateCourseMutation(data);
    } else {
      createCourseMutation(data);
    }
  }

  return (
    <div className="p-2 sm:p-4" ref={ref}>
      {!courseData && (<h1 className="text-xl font-bold text-indigo-900 mb-6 border-b pb-3">
        Create a New Course
      </h1>)}
      
      {(error || success) && (
        <div className="w-full max-w-4xl mx-auto mb-6">
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-300 p-3 mb-4">
                    <p className="text-sm font-medium text-red-700 text-center">
                        &#10060; {error}
                    </p>
                </div>
            )}
            {success && (
                <div className="rounded-lg bg-green-50 border border-green-300 p-3 mb-4">
                    <p className="text-sm font-medium text-green-700 text-center">
                        &#127881; {success}
                    </p>
                </div>
            )}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="space-y-6">

            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 pb-2 border-b">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Batch Name"
                        placeholder="e.g., Spring 2024 Full Stack Bootcamp"
                        {...register("batchName", { required: true })}
                    />

                    <DropDown
                        label="Batch Validity"
                        options={BatchValidityOptions}
                        {...register("validity", { required: true })}
                    />
                </div>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 pb-2 border-b">Pricing and Duration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Start Date"
                        type="date"
                        {...register("startDate", { required: true })}
                    />
                    <Input
                        label="End Date"
                        type="date"
                        {...register("endDate", { required: true })}
                    />

                    <Input
                        label="Price (in INR)"
                        type="number"
                        placeholder="e.g., 999"
                        {...register("price", { required: true, valueAsNumber: true, min: 0 })}
                    />
                    <Input
                        label="Discount (in INR)"
                        type="number"
                        placeholder="e.g., 99"
                        {...register("discount", { required: true, valueAsNumber: true, min: 0 })}
                    />
                </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 pb-2 border-b">Required Files</h3>
                {coverPicPreview ? (
                    <div className="mb-6 p-2 border border-gray-200 rounded-lg shadow-inner bg-gray-50 flex justify-center">
                        <img 
                            src={coverPicPreview} 
                            alt="Course Cover Preview" 
                            className="max-h-60 h-auto object-contain rounded-md shadow-lg border border-gray-300" 
                        />
                    </div>
                ) : (
                    <p className="mb-6 text-center text-sm text-gray-500 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                        No <strong>Course Cover Picture</strong> selected for preview.
                    </p>
                )}

                {curriculumPreview ? (
                    <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                        <embed 
                            src={curriculumPreview} 
                            type="application/pdf" 
                            width="100%" 
                            height="400px" 
                            className="min-h-96"
                        />
                    </div>
                ) : (
                    <p className="mb-6 text-center text-sm text-gray-500 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                        No <strong>Curriculum Document</strong> selected for preview.
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Course Cover Picture (Image)"
                        type="file"
                        accept="image/*"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-indigo-500 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer w-full"
                        {...register("coverPic", { required: !courseData || !courseData.id, onChange: (e) => handleCoverPicChange(e) })}
                    />

                    <Input
                        label="Course Curriculum Document (PDF Only)"
                        type="file"
                        accept=".pdf"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-indigo-500 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer w-full"
                        {...register("curriculum", { required: !courseData || !courseData.id, onChange: (e) => handleCurriculumChange(e) })}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <Button 
                type="submit"
                disabled={isLoading}
                className="cursor-pointer hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {
                    courseData && courseData.id ? (isLoading ? "Updating..." : "Update Course") : (isLoading ? "Creating..." : "Create Course")
                }
            </Button>
        </div>
      </form>
    </div>
  );
}

export default AddAndUpdateCourse;