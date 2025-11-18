import React from 'react'
import userService from '../codingsena/userService'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import Button from './fields/Button'
import Input from './fields/Input'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { Link } from 'react-router-dom'


function RestoreAccount() {

  const {register, handleSubmit, reset} = useForm();
  const navigate = useNavigate();
  const ref = useRef();

  const restoreUser = async(data) => {
    try {
        const response = await userService.restoreAccount(data);
        if(response.success) {
          toast.success(response.message || "Account restored successfully", {
            onClose: () => {
              navigate("/login");
              reset();  
            }
          });
        }
        else {
            toast.error(response.message || "Failed to restore account.");
        }
    } catch (error) {
        toast.error(error.message || "Failed to restore account.");
    } finally {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" ref={ref}>
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

        <form onSubmit={handleSubmit(restoreUser)} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            placeholder="your.email@example.com"
            {...register("email", { required: true })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Secure password"
            {...register("password", { required: true })}
          />

          <Button
            type="submit"
            className="relative w-full flex justify-center py-3 px-4 text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Restore Account
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
            Already have an active account?{" "}
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
        </div>
      </div>
    </div>
  );
}

export default RestoreAccount