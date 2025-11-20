import React from "react";
import { useForm } from "react-hook-form";
import { FaUsersCog } from "react-icons/fa"
import { FiX } from "react-icons/fi";
import Input from "./fields/Input";
import Button from "./fields/Button";

function EmailRequestModel({
    isOpen,
    onClose,
    onSubmit,
    title,
    label,
}) {
  const { register, handleSubmit, formState: {isSubmitting}, reset } = useForm();

  if(!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit((data) => onSubmit(data, reset))}>
          <div className="flex items-center justify-between p-5 border-b bg-white">
            <div className="flex items-center gap-2">
              <FaUsersCog className="text-indigo-600" size={22} />
              <h3 className="text-xl font-bold text-indigo-700">{title}</h3>
            </div>
            <button type="button" onClick={onClose}>
              <FiX
                className="text-indigo-700 hover:text-indigo-900 cursor-pointer"
                size={26}
              />
            </button>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <Input
              label={label}
              placeholder={`Enter ${label}`}
              {...register("userEmail", { required: true })}
            />
          </div>
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <Button
              onClick={onClose}
              bgColor="bg-gray-200"
              textColor="text-gray-800"
              className="rounded-md hover:bg-gray-300 font-medium cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              bgColor="bg-indigo-600"
              textColor="text-white"
              className="rounded-md hover:bg-indigo-700 font-medium cursor-pointer"
            >
              {isSubmitting ? "submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailRequestModel;