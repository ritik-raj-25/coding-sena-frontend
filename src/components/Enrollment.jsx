import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import courseService from "../codingsena/courseService";
import { toast } from "react-toastify";
import Button from "./fields/Button";
import enrollmentService from "../codingsena/enrollmentService";
import DetailBox from "./DetailBox";
import { FiCalendar, FiClock, FiDownload, FiUnlock } from "react-icons/fi";
import { useSelector } from "react-redux";

function Enrollment() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  
  const authSlice = useSelector((state) => state.authSlice);
  const userRoles = authSlice.userData?.roles?.map(role => role.roleName) || [];
  const isUserAdmin = userRoles.includes("ROLE_ADMIN");

  const handleBuyNow = async () => {
    try {
      const response = await enrollmentService.enrollStudentInCourse(courseId);
      if (response.success) {
        toast.success(
          response.message ||
            "Enrolled successfully! Redirecting for payment..."
        );
        setTimeout(() => {
          if (response?.resource?.checkoutUrl) {
            window.location.href = response.resource.checkoutUrl;
          } else {
            navigate("/dashboard/my-courses");
          }
        }, 5000);
      } else {
        toast.error(
          response.message || "Failed to enroll in course. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error?.message || "Failed to enroll in course. Please try again.",
        {
          onClose: () => {
            navigate("/login");
          },
        }
      );
    }
  };

  const getCourseDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return `${months} Months`;
  };

  const getValidityDuration = (validity) => {
    if (validity === "SIX_MONTHS") return "6 Months";
    if (validity === "ONE_YEAR") return "1 Year";
    if (validity === "TWO_YEAR") return "2 Years";
    if (validity === "LIFE_TIME") return "Lifetime Access";
    return "N/A";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    toast.error(
      error?.message || "Failed to load course details. Please try again.",
      {
        autoClose: 1000,
        onClose: () => {
          navigate("/courses");
        },
      }
    );
  }

  const course = data?.resource;
  const finalPrice = course?.price - course?.discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gray-900">
        <img
          src={course?.coverPicUrl}
          alt={course?.batchName}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gray-900/60"></div>

        <div className="absolute inset-0 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            {course?.batchName}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100 h-full">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">
              Course Information
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <DetailBox
                title="Start Date"
                value={new Date(course?.startDate).toLocaleDateString()}
                icon={<FiCalendar className="h-5 w-5" />}
              />
              <DetailBox
                title="End Date"
                value={new Date(course?.endDate).toLocaleDateString()}
                icon={<FiCalendar className="h-5 w-5" />}
              />
              <DetailBox
                title="Duration"
                value={getCourseDuration(course?.startDate, course?.endDate)}
                icon={<FiClock className="h-5 w-5" />}
              />
              <DetailBox
                title="Validity"
                value={getValidityDuration(course?.validity)}
                icon={<FiUnlock className="h-5 w-5" />}
              />
            </div>

            <div className="pt-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Course Curriculum
              </h3>
              {course?.curriculumUrl ? (
                <a
                  href={course?.curriculumUrl}
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg"
                >
                  <FiDownload className="h-6 w-6 mr-2" />
                  Download Full Curriculum
                </a>
              ) : (
                <p className="text-gray-500 italic">
                  Curriculum details not available for download.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-lg shadow-xl p-6 space-y-5 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                {isUserAdmin ? 'Price Details' : 'Secure Your Spot'}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Price:</span>
                  <span
                    className={`font-semibold ${
                      course?.discount > 0
                        ? "line-through text-red-400"
                        : "text-gray-800"
                    }`}
                  >
                    ₹{course?.price?.toLocaleString()}
                  </span>
                </div>

                {course?.discount > 0 && (
                  <div className="flex justify-between items-center text-lg text-green-600 font-bold">
                    <span className="text-green-600">Discount:</span>
                    <span className="text-xl">
                      - ₹{course?.discount?.toLocaleString() || "0"}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-extrabold text-gray-900">
                    Final Enrollment Fee:
                  </span>
                  <span className="text-4xl font-extrabold text-blue-600">
                    ₹{finalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {!isUserAdmin && <Button
              className="text-xl font-bold bg-green-500 hover:bg-green-600 text-white transition duration-200 uppercase tracking-wider shadow-lg mt-6 cursor-pointer"
              onClick={handleBuyNow}
            >
              Enroll Now & Get Instant Access
            </Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enrollment;
