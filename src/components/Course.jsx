import React, { useEffect } from "react";
import CourseCard from "./CourseCard";
import courseService from "../codingsena/courseService";
import { useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import DropDown from "./fields/DropDown";
import { LuArrowUpDown } from "react-icons/lu";
import Radio from "./fields/Radio";
import { toast } from "react-toastify";
import Button from "./fields/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Course() {
  const id = useId();
  const options = [
    {
      label: "Sort By...",
      value: "",
      selected: true,
      disabled: true,
    },
    { label: "Batch Name", value: "batchName" },
    { label: "Batch Validity", value: "validity" },
    { label: "Batch Start Date", value: "startDate" },
    { label: "Batch Price", value: "price" },
    { label: "Discount on Batch", value: "discount" },
  ];

  const [sortDir, setSortDir] = useState("ASC");
  const [courseFilter, setCourseFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const authSlice = useSelector((state) => state.authSlice);
  const userRoles = authSlice.userData?.roles?.map(role => role.roleName) || [];

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["courses", courseFilter, sortDir, pageNumber],
    queryFn: () => {
      if(isUserAdmin) {
        return courseService.getAllCoursesForAdmin(pageNumber, 4, courseFilter, sortDir);
      }
      else {
        return courseService.getAllActiveCourses(pageNumber, 4, courseFilter, sortDir);
      }
    },
      staleTime: 1000 * 60 * 5,          // cache is "fresh" for 5 minutes
      cacheTime: 1000 * 60 * 10,         // stays in memory for 10 mins after unmount
      refetchOnWindowFocus: false,       // doesn't refetch when you switch tabs
      refetchOnMount: false,             // won't refetch if cached data is still valid
      keepPreviousData: true,            // keeps previous data while fetching new data
  });

  useEffect(() => {
    setIsUserAdmin(userRoles.includes("ROLE_ADMIN"));
  }, [userRoles]);

  useEffect(() => {
    if(!data?.resource?.isLastPage) {
      queryClient.prefetchQuery({
        queryKey: ["courses", courseFilter, sortDir, pageNumber + 1],
        queryFn: () => {
          if(isUserAdmin) {
            return courseService.getAllCoursesForAdmin(pageNumber + 1, 4, courseFilter, sortDir);
          }
          else {
            return courseService.getAllActiveCourses(pageNumber + 1, 4, courseFilter, sortDir);
          }
        }       
      });
    }
  }, [data, pageNumber, courseFilter, sortDir, queryClient]);

  const handlePreviousButton = () => {
    if (pageNumber > 0) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNextButton = () => {
    if (!data?.resource?.isLastPage) {
      setPageNumber((prev) => prev + 1);
    }
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

  const getCourseDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${months} Months`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="flex items-center justify-center gap-2 text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
          Explore Our Cutting-Edge Courses 🚀
        </h1>
        <p className="text-gray-600 text-lg mb-12">
          Find the perfect track to boost your skills and career.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-around bg-white p-4 rounded-xl shadow-md">
        <div className="flex-1 w-full">
          <DropDown
            options={options}
            selectedOption={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-medium">
            <LuArrowUpDown className="text-indigo-600" />
            <span className="text-nowrap">Sort Direction:</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Radio
              name="sortDirection"
              label="Ascending"
              value="ASC"
              isSelected={sortDir === "ASC"}
              onChange={() => setSortDir("ASC")}
            />
            <Radio
              name="sortDirection"
              label="Descending"
              value="DESC"
              isSelected={sortDir === "DESC"}
              onChange={() => setSortDir("DESC")}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
        {data?.resource?.content?.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No courses available at the moment. Please check back later.
          </p>
        ) : (
          data?.resource?.content?.map((course) => (
            <CourseCard
              key={course.id}
              courseCoverImage={course.coverPicUrl}
              courseTitle={course.batchName}
              onClick={() => navigate(`${isUserAdmin ? `/my-courses/${course.id}/topics` : `/courses/${course.id}`}`, {state: ({course: course})})}
              courseDuration={getCourseDuration(
                course.startDate,
                course.endDate
              )}
              currentEnrollments={course.noOfStudentsEnrolled}
              isUserAdmin={isUserAdmin}
              isActive={course.isActive}
            />
          ))
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-12">
        <Button
          onClick={handlePreviousButton}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
            pageNumber > 0
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Previous
        </Button>

        <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-800">
          Page {data?.resource?.pageNumber + 1}
        </span>

        <Button
          onClick={handleNextButton}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
            data?.resource?.isLastPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Course;