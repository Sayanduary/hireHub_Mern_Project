import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    onChange([
      ...data,
      {
        degree: "",
        institution: "",
        duration: "",
        score: "",
      },
    ]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((edu, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 dark:border-[#333333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Education #{index + 1}
            </h4>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Degree / Course
              </Label>
              <Input
                placeholder="Bachelor of Science in Computer Science"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Institution Name
              </Label>
              <Input
                placeholder="University Name"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Duration
              </Label>
              <Input
                placeholder="2020 - 2024"
                value={edu.duration}
                onChange={(e) =>
                  updateEducation(index, "duration", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Score / CGPA
              </Label>
              <Input
                placeholder="3.8 / 4.0"
                value={edu.score}
                onChange={(e) =>
                  updateEducation(index, "score", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addEducation} variant="outline" className="gap-2 w-full">
        <Plus size={16} />
        Add Education
      </Button>
    </div>
  );
};

export default EducationForm;
