import React, { use, useEffect } from "react";
import Button from "./fields/Button";
import { useNavigate } from "react-router-dom";
import hero_section_image from "../assets/hero_section_image.png";
import courseService from "../codingsena/courseService";
import CourseCard from "./CourseCard";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState([]);
  const [isUserAdmin, setIsUserAdmin] = React.useState(false);

  const authSlice = useSelector((state) => state.authSlice);
  const userRoles = authSlice.userData?.roles?.map(role => role.roleName) || [];

  useEffect(() => {
    setIsUserAdmin(userRoles.includes("ROLE_ADMIN"));
  }, [userRoles]);

  const handleCall = () => {
    window.location.href = `tel:9798058211`;
  };

  const getCourseDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${months} Months`;
  };

  useEffect(() => {
    ;(async () => {
      try {
        const response = await courseService.getAllActiveCourses(0, 3);
        if (response.success) {
          setCourses(response.resource.content);
        } else {
          console.error("Failed to fetch courses:", response.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-center text-center md:text-left items-center md:justify-between bg-indigo-700 mt-10 mb-10 rounded-2xl p-6 sm:p-10 text-white">
        <div className="flex flex-col justify-center items-center md:items-start gap-2 md:w-[45%] w-full mb-6 md:mb-0">
          <p className="text-xs sm:text-sm font-semibold uppercase mb-2 text-yellow-400">
            Start Your Journey
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight mb-4">
            Master the Skills <br className="hidden sm:inline" />
            of the Future
          </h1>
          <p className="text-indigo-200 text-base sm:text-lg lg:text-xl px-2 sm:px-0">
            Join Coding Sena today and unlock your potential with expert-led
            courses, hands-on projects, and a supportive community.
          </p>
        </div>

        <div className="w-full md:w-[50%] flex flex-col items-center gap-4">
          <img
            src={hero_section_image}
            alt="Hero Section Image"
            className="w-full max-w-sm sm:max-w-md lg:max-w-full"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Button
              onClick={() => navigate("/courses")}
              className="w-full cursor-pointer sm:w-auto px-6 sm:px-8 py-3 border border-indigo-300 bg-yellow-400 text-gray-900 font-medium rounded-xl hover:bg-yellow-500 transition duration-300"
            >
              View All Courses
            </Button>
            <Button
              onClick={handleCall}
              className="w-full sm:w-auto cursor-pointer px-6 sm:px-8 py-3 border border-indigo-300 text-indigo-100 font-medium rounded-xl hover:bg-indigo-800 transition duration-300"
            >
              Talk to an Advisor
            </Button>
          </div>
        </div>
      </div>

      <section className="py-10 md:py-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-800">
          Our Featured Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 place-items-center">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              courseCoverImage={course.coverPicUrl}
              courseTitle={course.batchName}
              onClick={() => navigate(`${isUserAdmin ? `/my-courses/${course.id}/topics` : `/courses/${course.id}`}`)}
              courseDuration={getCourseDuration(
                course.startDate,
                course.endDate
              )}
              currentEnrollments={course.noOfStudentsEnrolled}
              isUserAdmin={isUserAdmin}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={() => navigate("/courses")}
            className="px-10 py-3 text-lg font-semibold rounded-xl transition duration-300 
                       bg-indigo-700 text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-2xl cursor-pointer max-w-xl w-full mx-auto flex justify-between items-center"
          >
            Explore All Courses
            <IoMdArrowRoundForward />
          </Button>
          
        </div>
      </section>
    </div>
  );
}

export default Home;