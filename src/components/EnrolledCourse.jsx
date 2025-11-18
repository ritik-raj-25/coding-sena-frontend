import React from "react";
import enrollmentService from "../codingsena/enrollmentService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EnrolledCourse() {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: () => enrollmentService.getEnrolledCourses(),
  });

  const navigate = useNavigate();

  const getCourseDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return `${months} Months`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    toast.error(error?.message || "Failed to load courses. Please try again.");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">
          Failed to load courses. Please try again later.
        </p>
      </div>
    );
  }

  if(data?.resource?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-gray-700 text-2xl mb-2 font-extrabold">
          You are not enrolled in any courses yet.
        </p>
        <p className="text-gray-600 mb-4 text-xl font-bold">
          Start your learning journey today!
        </p>
        <Link
          className="text-indigo-600 font-semibold text-2xl hover:underline decoration-wavy"
          to="/courses"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
     { data?.resource?.map((course) => (
          <CourseCard
            key={course.id}
            courseCoverImage={course.coverPicUrl}
            courseTitle={course.batchName}
            onClick={() => {navigate(`/my-courses/${course.id}/topics`)}}
            courseDuration={getCourseDuration(course.startDate, course.endDate)}
            currentEnrollments={course.noOfStudentsEnrolled}
          />
        ))
      }
    </div>
  );
}