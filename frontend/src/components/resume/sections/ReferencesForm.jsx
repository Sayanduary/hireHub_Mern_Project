import React, { useRef } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Upload, Download, X } from "lucide-react";
import { toast } from "sonner";

const ReferencesForm = ({ data, onChange }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          size: file.size,
          data: event.target?.result,
          uploadDate: new Date().toLocaleDateString(),
        };
        onChange(fileData);
        toast.success("PDF uploaded successfully");
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = () => {
    if (data?.data) {
      const blob = new Blob([new Uint8Array(data.data)], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.name || "references.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleRemove = () => {
    onChange(null);
    toast.success("File removed");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-700 dark:text-gray-300 block mb-3">
          Upload PDF References
        </Label>
        <div className="border-2 border-dashed border-gray-300 dark:border-[#444444] rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-[#555555] transition-colors cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="font-medium text-gray-900 dark:text-white">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PDF only, max 5MB
            </p>
          </button>
        </div>
      </div>

      {data && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-green-900 dark:text-green-300">
                {data.name}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                {(data.size / 1024 / 1024).toFixed(2)} MB • {data.uploadDate}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded transition-colors"
                title="Download PDF"
              >
                <Download
                  size={16}
                  className="text-green-700 dark:text-green-400"
                />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                title="Remove PDF"
              >
                <X size={16} className="text-red-700 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        📄 The PDF will be stored locally in your browser and included with your
        resume when downloaded.
      </p>
    </div>
  );
};

export default ReferencesForm;
