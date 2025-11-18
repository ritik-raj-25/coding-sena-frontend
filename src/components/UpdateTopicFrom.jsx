import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import topicService from "../codingsena/topicService";
import Button from "./fields/Button";
import Input from "./fields/Input";

function UpdateTopicForm({ topic, onSuccess, onCancel, courseId}) {
  const [name, setName] = useState(topic.name);
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
      const response = await topicService.updateTopic(topic.id, courseId, {name});
      if (response?.success) {
        toast.success(response.message || "Topic updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["topics", courseId] });
        onSuccess();
      } 
      else {
        toast.error(response?.message || "Failed to update topic.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update topic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Edit Topic</h3>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer hover:bg-blue-800 transition-colors">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" bgColor="bg-gray-500" onClick={onCancel} className="cursor-pointer hover:bg-gray-800 transition-colors">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdateTopicForm;