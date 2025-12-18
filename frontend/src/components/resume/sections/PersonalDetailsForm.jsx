import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";

const PersonalDetailsForm = ({ data, onChange, countryConfig = {} }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const getPhoneDisplay = () => {
    if (!data.phone) return "";
    // Only remove country code if it starts with + (like +91)
    return data.phone.replace(/^\+\d{1,3}\s*/, "").trim();
  };

  const handleProfileChange = (index, field, value) => {
    const updatedProfiles = [...(data.profiles || [])];
    updatedProfiles[index] = { ...updatedProfiles[index], [field]: value };

    onChange({
      ...data,
      profiles: updatedProfiles,
    });
  };

  const addProfile = () => {
    onChange({
      ...data,
      profiles: [...(data.profiles || []), { platform: "", url: "" }],
    });
  };

  const removeProfile = (index) => {
    onChange({
      ...data,
      profiles: (data.profiles || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* =====================
         Contact Information
      ====================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>

        <div className="space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Sayan Duary"
                value={data.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="sayan@gmail.com"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Country + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Country</Label>
              <select
                value={data.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              >
                {Object.entries(countryConfig).map(([code, cfg]) => (
                  <option
                    key={code}
                    value={code}
                    className="bg-white text-black dark:bg-[#1a1a1a] dark:text-white"
                  >
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center border border-gray-300 dark:border-[#444444] rounded-md bg-white dark:bg-[#1a1a1a] overflow-hidden">
                <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-300 dark:border-[#444444] whitespace-nowrap">
                  {countryConfig[data.country]?.code || "+91"}
                </span>
                <input
                  id="phone"
                  type="text"
                  placeholder="9876543210"
                  value={getPhoneDisplay()}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent text-gray-900 dark:text-white outline-none text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter phone number without country code
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State, Country (e.g. Kolkata, West Bengal, India)"
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* =====================
         Social Profiles
      ====================== */}
      <div className="border-t border-gray-200 dark:border-[#333333] pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Social Profiles & Links
        </h3>

        <div className="space-y-3">
          {(data.profiles || []).map((profile, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs">Platform</Label>
                <Input
                  placeholder="LinkedIn, GitHub, Portfolio"
                  value={profile.platform}
                  onChange={(e) =>
                    handleProfileChange(index, "platform", e.target.value)
                  }
                />
              </div>

              <div className="flex-1">
                <Label className="text-xs">URL</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={profile.url}
                  onChange={(e) =>
                    handleProfileChange(index, "url", e.target.value)
                  }
                />
              </div>

              <button
                onClick={() => removeProfile(index)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={addProfile}
          variant="outline"
          className="gap-2 mt-4 w-full"
        >
          <Plus size={16} />
          Add Profile Link
        </Button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        * Required fields
      </p>
    </div>
  );
};

export default PersonalDetailsForm;
