import React from "react";
import { useForm } from "react-hook-form";
import Input from "./fields/Input";
import Button from "./fields/Button";
import { useState } from "react";
import skillService from "../codingsena/skillService";
import { toast } from "react-toastify";


function AddSkill() {
  const { register, handleSubmit, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
        setIsLoading(true);
        const response = await skillService.createSkill({
            title: data.skillName,
        });
        if(response?.success) {
            setIsLoading(false);
            toast.success(response.message || "Skill created successfully.");
            reset();
        }
        else {
            setIsLoading(false);
            toast.error(response.message || "Failed to create skill. Please try again.");
        }
    } catch (error) {
        setIsLoading(false);
        toast.error(error.message || "Failed to create skill. Please try again.");
    }
  }

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl font-bold text-indigo-900 mb-6 border-b pb-3">
        Create a New Skill
      </h1>
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-indigo-800 mb-4 pb-2 border-b">
            Add New Skill
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Skill Name"
              placeholder="e.g., JavaScript, Java, Python"
              {...register("skillName", { required: true })}
            />
            
        </div>
      </div>
      <div className="flex justify-end pt-4">
            <Button 
                type="submit"
                disabled={isLoading}
                className="cursor-pointer hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {
    isLoading ? "Creating Skill..." : "Create Skill"
                }
            </Button>
            </div>
      </div>
    </form>
    </div>
  );
}

export default AddSkill;
