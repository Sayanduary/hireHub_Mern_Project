import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";

const PersonalDetailsForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
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
    const updatedProfiles = [
      ...(data.profiles || []),
      { platform: "", url: "" },
    ];
    onChange({
      ...data,
      profiles: updatedProfiles,
    });
  };

  const removeProfile = (index) => {
    const updatedProfiles = (data.profiles || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      profiles: updatedProfiles,
    });
  };

  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
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
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
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
              <Label
                htmlFor="phone"
                className="text-gray-700 dark:text-gray-300"
              >
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
        </div>
      </div>

      {/* Social Profiles */}
      <div className="border-t border-gray-200 dark:border-[#333333] pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Social Profiles & Links
          </h3>
        </div>

        <div className="space-y-3">
          {(data.profiles || []).map((profile, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs text-gray-600 dark:text-gray-400">
                  Platform Name
                </Label>
                <Input
                  placeholder="e.g., LinkedIn, GitHub, Portfolio"
                  value={profile.platform}
                  onChange={(e) =>
                    handleProfileChange(index, "platform", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-gray-600 dark:text-gray-400">
                  URL
                </Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={profile.url}
                  onChange={(e) =>
                    handleProfileChange(index, "url", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <button
                onClick={() => removeProfile(index)}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X size={20} />
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
