import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { Textarea } from "../../ui/textarea";

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    onChange([
      ...data,
      {
        position: "",
        organization: "",
        duration: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 dark:border-[#333333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Experience #{index + 1}
            </h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Role / Position
              </Label>
              <Input
                placeholder="Senior Developer"
                value={exp.position}
                onChange={(e) =>
                  updateExperience(index, "position", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Organization
              </Label>
              <Input
                placeholder="Company Name"
                value={exp.organization}
                onChange={(e) =>
                  updateExperience(index, "organization", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-gray-700 dark:text-gray-300">Duration</Label>
            <Input
              placeholder="Jan 2021 - Present"
              value={exp.duration}
              onChange={(e) =>
                updateExperience(index, "duration", e.target.value)
              }
              className="mt-1"
            />
          </div>

          <div className="mt-4">
            <Label className="text-gray-700 dark:text-gray-300">
              Description (Markdown supported)
            </Label>
            <Textarea
              placeholder="Describe your responsibilities and achievements. Use - for bullet points or **text** for bold."
              value={exp.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              className="mt-1 min-h-24 font-mono text-sm"
            />
          </div>
        </div>
      ))}

      <Button
        onClick={addExperience}
        variant="outline"
        className="gap-2 w-full"
      >
        <Plus size={16} />
        Add Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;
