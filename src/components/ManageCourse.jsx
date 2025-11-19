import React from "react";
import enrollmentService from "../codingsena/enrollmentService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdErrorOutline } from "react-icons/md";
import CourseCard from "./CourseCard";
import { useNavigate, useParams } from "react-router-dom";

function ManageCourse() {
  const navigate = useNavigate();

  const { courseId } = useParams();
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trainer-courses"],
    queryFn: () => enrollmentService.getTrainerCourses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error?.message || "Failed to load courses.";
    toast.error(errorMessage);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <MdErrorOutline className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-red-600 text-lg text-center font-semibold">
          {errorMessage}
        </p>
        <p className="text-gray-600 text-center mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  const getCourseDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return `${months} Months`;
  };

  if (data?.resource?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-gray-700 text-2xl mb-2 font-extrabold">
          You are not a trainer for any courses yet.
        </p>
        <p className="text-gray-600 mb-4 text-xl font-bold">
          Contact admin to for assign you to a course.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
      {data?.resource?.map((course) => (
        <CourseCard
          key={course.id}
          courseCoverImage={course.coverPicUrl}
          courseTitle={course.batchName}
          onClick={() => {
            navigate(`/my-courses/${course.id}/topics`);
          }}
          courseDuration={getCourseDuration(course.startDate, course.endDate)}
          currentEnrollments={course.noOfStudentsEnrolled}
          isUserTrainer={true}
        />
      ))}
    </div>
  );
}

export default ManageCourse;
