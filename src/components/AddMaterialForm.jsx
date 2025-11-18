import { useState } from "react";
import { toast } from "react-toastify";
import studyMaterialService from "../codingsena/studyMaterialService";
import Button from "./fields/Button";
import Input from "./fields/Input";
import DropDown from "./fields/DropDown";

function AddMaterialForm({ courseId, topicId, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("VIDEO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const MATERIAL_TYPES = [
    { value: "VIDEO", label: "VIDEO" },
    { value: "PDF", label: "PDF" },
    { value: "LINK", label: "LINK" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error("Title and URL are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await studyMaterialService.addStudyMaterial({title, url, type, topicId, courseId});
      if (response?.success) {
        toast.success(response.message || "Material added successfully!");
        onSuccess();
      } 
      else {
        toast.error(response?.message || "Failed to add study material.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to add study material");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner my-4 border border-gray-200">
      <h3 className="text-md font-semibold mb-3 text-gray-700">Add New Study Material</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Material Title"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Material URL (Google Drive PDF Link, Youtube Video Link or General Link)"
        />
        <DropDown
          options = {MATERIAL_TYPES}
          onChange = {(e) => {setType(e.target.value)}}
          selectedOption = {type}
        />
        
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer hover:bg-blue-800">
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
          <Button type="button" bgColor="bg-gray-500" onClick={onCancel} className="cursor-pointer hover:bg-gray-800">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddMaterialForm;