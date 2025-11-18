import { useState } from "react";
import { toast } from "react-toastify";
import studyMaterialService from "../codingsena/studyMaterialService";
import Button from "./fields/Button";
import Input from "./fields/Input";
import DropDown from "./fields/DropDown";

function UpdateMaterialForm({ material, onSuccess, onCancel }) {
  const [title, setTitle] = useState(material.title);
  const [url, setUrl] = useState(material.url);
  const [type, setType] = useState(material.type);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MATERIAL_TYPES = [
    { value: "VIDEO", label: "VIDEO" },
    { value: "PDF", label: "PDF" },
    { value: "LINK", label: "LINK" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error("Title and URL are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await studyMaterialService.updateStudyMaterial(
        material.id,
        {title, url, type}
      );
      if (response?.success) {
        toast.success(response?.message || "Material updated!");
        onSuccess();
      } 
      else {
        toast.error(response?.message || "Failed to update material.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update material.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 bg-blue-50 rounded-lg my-2 border border-blue-200">
      <h4 className="text-sm font-semibold mb-2 text-blue-700">
        Edit Material
      </h4>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Material Title"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Material URL"
        />
        <DropDown
          options = {MATERIAL_TYPES}
          onChange = {(e) => {setType(e.target.value)}}
          selectedOption = {type}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer hover:bg-blue-800 transition-colors">
            {isSubmitting ? "Saving..." : "Update"}
          </Button>
          <Button type="button" bgColor="bg-gray-500" onClick={onCancel} className="cursor-pointer bg-gray-800 transition-colors">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdateMaterialForm;
