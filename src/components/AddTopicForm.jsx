import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import topicService from "../codingsena/topicService";
import Button from "./fields/Button";
import Input from './fields/Input'

function AddTopicForm({ courseId, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Topic name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await topicService.addTopic({ name, courseId });
      if (response?.success) {
        toast.success(response?.message || "Topic added successfully!");
        queryClient.invalidateQueries({ queryKey: ["topics", courseId] });
        onSuccess();
      } else {
        toast.error(response?.message || "Failed to add topic.");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-inner mb-4">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Add New Topic</h3>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter topic name"
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer hover:bg-blue-800 transition-colors">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button type="button" bgColor="bg-gray-500" onClick={onCancel} className="cursor-pointer hover:bg-gray-800 transition-colors">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddTopicForm;