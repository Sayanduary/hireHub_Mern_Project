import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const PersonalDetailsForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="fullName"
            className="text-gray-700 dark:text-gray-300"
          >
            Full Name *
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label
            htmlFor="location"
            className="text-gray-700 dark:text-gray-300"
          >
            Location
          </Label>
          <Input
            id="location"
            placeholder="New York, NY"
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        * Required fields
      </p>
    </div>
  );
};

export default PersonalDetailsForm;
