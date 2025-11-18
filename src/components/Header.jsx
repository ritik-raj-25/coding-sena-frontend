import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Input from "../components/fields/Input";
import default_profile_image from "../assets/default_profile_image.png";
import coursesNavbarGif from "../assets/coursesNavbarGif.gif";
import { AiOutlineMenuFold } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MdKeyboardArrowRight } from "react-icons/md";
import courseService from "../codingsena/courseService";

function Header() {
  const navigate = useNavigate();
  const authSlice = useSelector((state) => state.authSlice);
  const [on, setOn] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    (async () => {
      try {
        if (search.trim() !== "") {
          const response = await courseService.searchCourseByName(
            search,
            "batchName",
            "ASC",
            0,
            10
          );
          if (response.success) {
            setCourses(response.resource.content);
          } else {
            toast.error(response.message || "Failed to fetch courses");
          }
        } else {
          setCourses([]);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch courses");
      }
    })();
  }, [search]);

  const handleCourseClick = (courseId) => {
    setSearch("");
    setCourses([]);
    navigate(`/courses/${courseId}`);
  };

  const toggleMenu = () => setOn((prev) => !prev);

  return (
    <header className="w-full bg-white shadow-[0px_1px_8px_0px_rgba(0,0,0,0.08)] h-[72px] font-sans sticky top-0 z-50">
      <div className="px-4 sm:px-8 md:px-12 max-w-full h-full">
        <div className="h-full flex justify-between items-center">
          <div
            className="cursor-pointer w-[100px] xl:w-[150px]"
            onClick={() => navigate("/")}
          >
            <Logo />
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:flex flex-1 justify-between items-center xl:ml-10 md:ml-5">
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `text-sm md:text-base font-semibold border-b-2 transition-colors duration-300 hover:text-orange-600 hover:border-orange-600 ${
                  isActive
                    ? "text-orange-600 border-orange-600"
                    : "border-white"
                }`
              }
            >
              <p className="px-3 relative">
                Courses
                <img
                  src={coursesNavbarGif}
                  alt="icon"
                  className="absolute z-[-1]"
                  style={{
                    width: 110,
                    height: 110,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </p>
            </NavLink>
            <div className="relative w-full max-w-sm mx-4">
              <Input
                placeholder="Search courses..."
                withSearchIcon={true}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="w-full"
              />
              {courses && courses.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-[100] mt-1">
                  <div className="overflow-y-auto max-h-80 bg-white border border-gray-300 rounded-lg shadow-xl">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 text-sm text-gray-800 border-b border-gray-100 cursor-pointer transition-colors duration-150 last:border-b-0 hover:bg-gray-50 hover:font-bold flex justify-between items-center"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        {course.batchName}
                        <MdKeyboardArrowRight className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {!authSlice.status && (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="border border-orange-500 text-orange-500 hover:text-orange-600 hover:border-orange-600 text-sm md:text-base px-5 py-2 font-semibold rounded-md cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="border border-orange-500 text-orange-500 hover:text-orange-600 hover:border-orange-600 text-sm md:text-base px-5 py-2 font-semibold rounded-md cursor-pointer"
                  >
                    Signup
                  </button>
                </>
              )}
              {authSlice.status && (
                <Link
                  className="w-12 h-12 overflow-hidden cursor-pointer"
                  to="/dashboard"
                >
                  <img
                    src={
                      authSlice.userData?.profilePicUrl || default_profile_image
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full border-4 border-yellow-400 object-cover"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {!on ? (
              <AiOutlineMenuFold
                size={25}
                className="cursor-pointer"
                onClick={toggleMenu}
              />
            ) : (
              <RxCross2
                size={25}
                className="cursor-pointer"
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {on && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-4">
          {!authSlice.status ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  toggleMenu();
                  navigate("/login");
                }}
                className="border border-orange-500 text-orange-500 hover:text-orange-600 hover:border-orange-600 text-sm px-4 py-2 rounded-md cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  toggleMenu();
                  navigate("/signup");
                }}
                className="border border-orange-500 text-orange-500 hover:text-orange-600 hover:border-orange-600 text-sm px-4 py-2 rounded-md cursor-pointer"
              >
                Signup
              </button>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="flex justify-between items-center text-base font-semibold hover:text-orange-600"
              onClick={toggleMenu}
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    authSlice.userData?.profilePicUrl || default_profile_image
                  }
                  alt="Profile"
                  className="w-12 h-12 border-4 border-yellow-400 rounded-full object-cover"
                />
                <span className="font-semibold">
                  {authSlice.userData?.name || "Profile"}
                </span>
              </div>
              <MdKeyboardArrowRight />
            </Link>
          )}
          <Link
            to="/courses"
            className="flex justify-between items-center text-base font-semibold hover:text-orange-600"
            onClick={toggleMenu}
          >
            Courses
            <MdKeyboardArrowRight />
          </Link>
          <div className="relative w-full">
            <Input
              placeholder="Search courses..."
              withSearchIcon={true}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full"
            />
            {courses && courses.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[100] mt-1">
                <div className="overflow-y-auto max-h-80 bg-white border border-gray-300 rounded-lg shadow-xl">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-3 text-sm text-gray-800 border-b border-gray-100 cursor-pointer transition-colors duration-150 last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      {course.batchName}
                      <MdKeyboardArrowRight className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;