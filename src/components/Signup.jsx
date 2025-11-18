import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Input from "./fields/Input";
import Button from "./fields/Button";
import userService from "../codingsena/userService";
import skillService from "../codingsena/skillService";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";
import { BiHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";

function Signup() {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skills, setSkills] = useState([]);
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  const createUser = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (data.skills) {
        data = {
          ...data,
          skills: data.skills.map((id) => ({ id: Number(id) })),
        };
      } else {
        data = {
          ...data,
          skills: [],
        };
      }
      const response = await userService.registerUser(data);
      if (response.success) {
        setSuccess(
          response.message ||
            "Registration successful! Please check your email for verification."
        );
        reset();
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const skillsResponse = await skillService.getSkills();
        setSkills(skillsResponse.resource || []);
      } catch (err) {
        console.error("Error fetching skills:", err.message);
      }
    })();
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      ref={ref}
    >
      <div className="w-full max-w-xl space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="w-full flex justify-center mb-4">
            <Logo height="50px" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase">
            Create Your Student Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start learning, building, and growing with our community.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-300 p-3">
            <p className="text-sm font-medium text-red-700 text-center">
              &#10060; {error}
            </p>
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 border border-green-300 p-3">
            <p className="text-sm font-medium text-green-700 text-center">
              &#127881; {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(createUser)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register("name", { required: true })}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="your.email@example.com"
            {...register("email", { required: true })}
          />
          <div className="relative w-auto">
            <Input
              label="Password"
              type={show ? "text" : "password"}
              placeholder="Secure password"
              {...register("password", { required: true })}
            />
            {show ? (<BiHide onClick={() => setShow(prev => !prev)} className="w-5 absolute right-3 top-[42px] text-gray-500 w-7 h-7 cursor-pointer"/>) : (<BiSolidShow onClick={() => setShow(prev => !prev)} className="absolute right-3 top-[42px] w-7 h-7 text-gray-500 cursor-pointer"/>)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              {...register("dob", { required: true })}
            />
            <Input
              label="Nick Name"
              placeholder="Community handle"
              {...register("nickName", { required: true })}
            />
          </div>
          <Input
            label="College/University"
            placeholder="Your current or previous institution"
            {...register("college")}
          />
          <Input
            label="Location"
            placeholder="City, Country"
            {...register("location")}
          />

          {skills.length > 0 && (
            <div className="pt-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Your Key Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center space-x-2 border border-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 transition duration-150 ease-in-out cursor-pointer bg-gray-50 hover:bg-indigo-50 has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600"
                  >
                    <input
                      type="checkbox"
                      value={skill.id}
                      {...register("skills")}
                      className="absolute opacity-0 h-0 w-0"
                    />
                    <span>{skill.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Input
            label="Profile Picture"
            type="file"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-indigo-500 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
            {...register("profilePic")}
          />

          <Button
            type="submit"
            className="relative cursor-pointer w-full flex justify-center py-3 px-4 text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Create Your Account
          </Button>
        </form>

        <div className="space-y-4">
          <p className="text-center text-sm text-gray-500">
            Not verified?{" "}
            <Link
              to="/email-verification"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition duration-150 hover:underline"
            >
              Resend verification email
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500">
            Have an inactive account?{" "}
            <Link
              to="/restore-account"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition duration-150 hover:underline"
            >
              Restore
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition duration-150 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;