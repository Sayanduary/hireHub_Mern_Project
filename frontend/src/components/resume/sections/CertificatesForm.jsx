import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";

const CertificatesForm = ({ data, onChange }) => {
  const addCertificate = () => {
    onChange([
      ...data,
      {
        title: "",
        link: "",
      },
    ]);
  };

  const updateCertificate = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCertificate = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((cert, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 dark:border-[#333333] rounded-lg bg-gray-50 dark:bg-[#1a1a1a]"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Certificate #{index + 1}
            </h4>
            <button
              onClick={() => removeCertificate(index)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Certificate Title / Description
              </Label>
              <Input
                placeholder="AWS Certified Solutions Architect"
                value={cert.title}
                onChange={(e) =>
                  updateCertificate(index, "title", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Certificate Link
              </Label>
              <Input
                type="url"
                placeholder="https://aws.amazon.com/certification/..."
                value={cert.link}
                onChange={(e) =>
                  updateCertificate(index, "link", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={addCertificate}
        variant="outline"
        className="gap-2 w-full"
      >
        <Plus size={16} />
        Add Certificate
      </Button>
    </div>
  );
};

export default CertificatesForm;
