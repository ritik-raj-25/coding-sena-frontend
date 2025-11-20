import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Input from "./fields/Input";
import Button from "./fields/Button";
import Logo from "./Logo";
import {useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import authService from "../codingsena/authService";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { BiHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";

function Login() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loginUser = async (data) => {
    setError("");
    setSuccess("");
    try {
      const response = await authService.login(data);
      if (response?.success) {
        setSuccess(response.message || "Login successful!");
        dispatch(login({ userData: response.resource }));
        reset();
        navigate("/");
      } else {
        setError(response?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
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
        
        {/* Demo Credentials */}
        <div className="mt-1 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <p className="font-semibold text-gray-800 mb-2 text-sm">Demo Credentials</p>

          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Admin:</strong> rajritik2511@gmail.com / Admin@123</p>
            <p><strong>Trainer:</strong> ritikbunty2511@gmail.com / Trainer@123</p>
            <p><strong>Learner:</strong> ritik.raj2024@vitstudent.ac.in / Learner@123</p>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              onClick={() => {
                document.querySelector("input[name='email']").value = "rajritik2511@gmail.com";
                document.querySelector("input[name='password']").value = "Admin@123";
              }}
              bgColor="bg-indigo-600"
              textColor="text-white"
              className="px-3 py-1 text-xs rounded hover:bg-indigo-700 cursor-pointer"
            >
              Admin Demo
            </Button>

            <Button
              type="button"
              onClick={() => {
                document.querySelector("input[name='email']").value = "ritikbunty2511@gmail.com";
                document.querySelector("input[name='password']").value = "Trainer@123";
              }}
              bgColor="bg-green-600"
              textColor="text-white"
              className="px-3 py-1 text-xs rounded hover:bg-green-700 cursor-pointer"
            >
              Trainer Demo
            </Button>

            <Button
              type="button"
              onClick={() => {
                document.querySelector("input[name='email']").value = "ritik.raj2024@vitstudent.ac.in";
                document.querySelector("input[name='password']").value = "Learner@123";
              }}
              bgColor="bg-yellow-600"
              textColor="text-white"
              className="px-3 py-1 text-xs rounded hover:bg-yellow-700 cursor-pointer"
            >
              Learner Demo
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(loginUser)} className="space-y-5">
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
            {show ? (
              <BiHide
                onClick={() => setShow((prev) => !prev)}
                className="w-5 absolute right-3 top-[42px] text-gray-500 w-7 h-7 cursor-pointer"
              />
            ) : (
              <BiSolidShow
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3 top-[42px] w-7 h-7 text-gray-500 cursor-pointer"
              />
            )}
          </div>

          <Button
            type="submit"
            className="relative w-full flex justify-center py-3 px-4 text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer"
          >
            Login
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
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition duration-150 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;