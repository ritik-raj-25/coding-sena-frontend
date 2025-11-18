import React, { useState, useEffect, useRef } from "react";
import userService from "../codingsena/userService";
import { useSearchParams, useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import Input from "./fields/Input";
import Button from "./fields/Button";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";

function EmailVerification() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  const resendVerificationEmail = async (data) => {
    setError("");
    setSuccess("");
    try {
        const response = await userService.resendVerificationEmail(data);
        if(response?.success) {
            setSuccess(response.message || "Verification email sent! Please check your inbox.");
            reset();
        }
        else {
            setError(response?.message || "Failed to send verification email. Please try again.");
        }
    }catch(err) {
        setError(err.message || "Failed to send verification email. Please try again.");
    } finally {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const tokenFromParams = searchParams.get("token");
    setToken(tokenFromParams || "");
    if (tokenFromParams) {
      (async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
          const response = await userService.verifyEmail(tokenFromParams);
          if (response?.success) {
            setSuccess(
              response.message ||
                "Email verified successfully! Redirecting to login..."
            );
            reset();
            setTimeout(() => {
                navigate("/login");
            }, 2000);
          } else {
            setError(
              response?.message ||
                "Email verification failed. Please try again."
            );
          }
        } catch (err) {
          setError(
            err.message || "Email verification failed. Please try again."
          );
        } finally {
          setLoading(false);
          setToken("");
          ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      })();
    }
  }, [searchParams]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

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
          {!token && (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 uppercase">
                Verify Your Email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Start learning, building, and growing with our community.
              </p>
            </>
          )}
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

        {!token && !success && (
          <form onSubmit={handleSubmit(resendVerificationEmail)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="your.email@example.com"
              {...register("email", { required: true })}
            />

            <Button
              type="submit"
              className="relative w-full flex justify-center py-3 px-4 text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
                Resend Verification Email
            </Button>
          </form>
        )}

        { !success &&  (<div className="space-y-4">
          <p className="text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition duration-150 hover:underline"
            >
              Login
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
        </div>)}
      </div>
    </div>
  );
}

export default EmailVerification;