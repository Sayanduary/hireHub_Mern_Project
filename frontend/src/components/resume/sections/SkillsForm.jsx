import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { Textarea } from "../../ui/textarea";

const SkillsForm = ({ data, onChange }) => {
  const [inputMethod, setInputMethod] = useState(
    data.length > 0 ? "list" : "comma"
  );
  const [csvInput, setCsvInput] = useState(data.join(", "));
  const [newSkill, setNewSkill] = useState("");

  const handleCsvChange = (value) => {
    setCsvInput(value);
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onChange(skills);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...data, newSkill.trim()];
      onChange(updatedSkills);
      setCsvInput(updatedSkills.join(", "));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = data.filter((_, i) => i !== index);
    onChange(updatedSkills);
    setCsvInput(updatedSkills.join(", "));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 dark:border-[#333333]">
        <button
          onClick={() => setInputMethod("comma")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            inputMethod === "comma"
              ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          Comma Separated
        </button>
        <button
          onClick={() => setInputMethod("list")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            inputMethod === "list"
              ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          Add One by One
        </button>
      </div>

      {inputMethod === "comma" ? (
        <div>
          <Label className="text-gray-700 dark:text-gray-300">
            Enter skills separated by commas
          </Label>
          <Textarea
            placeholder="Python, React, Node.js, MongoDB, AWS, Docker"
            value={csvInput}
            onChange={(e) => handleCsvChange(e.target.value)}
            className="mt-1 min-h-24"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleAddSkill} className="gap-2">
              <Plus size={16} />
              Add
            </Button>
          </div>

          {data.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills ({data.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-full"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {skill}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-800 dark:text-blue-300">
        💡 {data.length} skill{data.length !== 1 ? "s" : ""} added
      </div>
    </div>
  );
};

export default SkillsForm;
