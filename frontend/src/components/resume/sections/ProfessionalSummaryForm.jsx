import React, { useState } from "react";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import ReactMarkdown from "react-markdown";

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-gray-700 dark:text-gray-300">
            Professional Summary
          </Label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {!showPreview ? (
          <Textarea
            placeholder="Write a compelling professional summary. Markdown is supported (use **bold**, *italic*, etc.)"
            value={data}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-32 font-mono text-sm"
          />
        ) : (
          <div className="min-h-32 p-4 border border-gray-200 dark:border-[#333333] rounded-md bg-gray-50 dark:bg-[#1a1a1a] prose dark:prose-invert max-w-none">
            {data ? (
              <ReactMarkdown className="text-sm text-gray-700 dark:text-gray-300">
                {data}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">No summary added yet</p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Tip: Use **text** for bold, *text* for italic, and line breaks for
        formatting
      </p>
    </div>
  );
};

export default ProfessionalSummaryForm;
