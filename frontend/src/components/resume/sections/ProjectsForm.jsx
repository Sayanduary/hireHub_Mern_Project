import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { Textarea } from "../../ui/textarea";

const ProjectsForm = ({ data, onChange }) => {
  const addProject = () => {
    onChange([
      ...data,
      {
        description: "",
        link: "",
      },
    ]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((project, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 dark:border-[#333333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Project #{index + 1}
            </h4>
            <button
              onClick={() => removeProject(index)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              Project Description (Markdown supported)
            </Label>
            <Textarea
              placeholder="Describe your project, technologies used, and key features. Use **text** for bold or - for bullet points."
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
              className="mt-1 min-h-24 font-mono text-sm"
            />
          </div>

          <div className="mt-4">
            <Label className="text-gray-700 dark:text-gray-300">
              Project Link
            </Label>
            <Input
              type="url"
              placeholder="https://github.com/username/project"
              value={project.link}
              onChange={(e) => updateProject(index, "link", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      ))}

      <Button onClick={addProject} variant="outline" className="gap-2 w-full">
        <Plus size={16} />
        Add Project
      </Button>
    </div>
  );
};

export default ProjectsForm;
