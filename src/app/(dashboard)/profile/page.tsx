"use client";

import { useState, useEffect } from "react";
import { Upload, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";

//profile icons
import Profile1 from "@/public/assets/profilepics/profile1.svg";
import Profile2 from "@/public/assets/profilepics/profile2.svg";
import Profile3 from "@/public/assets/profilepics/profile3.svg";
import Profile4 from "@/public/assets/profilepics/profile4.svg";
import Profile5 from "@/public/assets/profilepics/profile5.svg";
import Profile6 from "@/public/assets/profilepics/profile6.png";
import Navbar from "@/src/components/navbar";
import { useUpdateProfileMutation,useLazyGetProfileQuery } from "@/src/services/userManagement";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/src/components/ProtectedRoute";

type UpdateMode = "upload" | "select";

interface ProfileData {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  profilePic: string;
  jobTitle: string;
  businessUnit: string;
  managerName: string;
}

export default function ProfileUpdate() {
  const [mode, setMode] = useState<UpdateMode>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("details");
const {data:session} = useSession()
  // Form data state
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    profilePic: "",
    jobTitle: "",
    businessUnit: "",
    managerName: "",
  });

  const [updateProfile, updateProfileProps] = useUpdateProfileMutation();
  const [getProfile, getProfileProps] = useLazyGetProfileQuery();
  const router = useRouter();



  // Load existing profile data
  useEffect(() => {
    if (getProfileProps.isSuccess && getProfileProps.data) {
      const profileData = getProfileProps.data;

      // Extract data from profile response
      const businessUnit =
        profileData.attributes?.find((attr) => attr.name === "BUSINESS_UNIT")
          ?.value || "";
      const managerName =
        profileData.attributes?.find((attr) => attr.name === "MANAGER_NAME")
          ?.value || "";
      const jobTitle =
        profileData.attributes?.find((attr) => attr.name === "JOB_TITLE")
          ?.value || "";

      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        gender: profileData.gender || "",
        phone: profileData.phone || "",
        profilePic: profileData.profilePic?.url || "",
        jobTitle: jobTitle,
        businessUnit: businessUnit,
        managerName: managerName,
      });
    }
  }, [getProfileProps.isSuccess, getProfileProps.data]);

  // Handle update profile API response
  useEffect(() => {
    if (updateProfileProps.isSuccess) {
      setSuccess("Profile updated successfully!");
      setError("");
    }
  }, [updateProfileProps.isSuccess, router]);

  // Handle update profile error
  useEffect(() => {
    if (updateProfileProps.isError) {
      setError("Failed to update profile. Please try again.");
      setSuccess("");
    }
  }, [updateProfileProps.isError]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setSelectedAvatar(null); // Clear avatar selection when file is dropped
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        handleInputChange("profilePic", previewUrl);
        setError(""); // Clear any previous errors
      } else {
        setError("Please select an image file (JPEG, PNG, SVG)");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setSelectedAvatar(null); // Clear avatar selection when file is selected
        const previewUrl = URL.createObjectURL(file);
        handleInputChange("profilePic", previewUrl);
        setError(""); // Clear any previous errors
      } else {
        setError("Please select an image file (JPEG, PNG, SVG)");
      }
    }
  };

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    setSelectedFile(null); // Clear file selection when avatar is selected
    // Set a default avatar URL or path
    handleInputChange("profilePic", `/avatars/avatar-${index + 1}.png`);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required.");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for the API call
      const formDataPayload = new FormData();

      let profilePicFilename = null;

      // Handle profile picture - either uploaded file or selected avatar
      if (selectedFile) {
        // User uploaded a custom file
        profilePicFilename = selectedFile.name;
        formDataPayload.append("files", selectedFile, selectedFile.name);
      } else if (selectedAvatar !== null) {
        // User selected a predefined avatar - fetch it and add as file
        try {
          const avatarSrc =
            profilePics[selectedAvatar].src || profilePics[selectedAvatar];
          const response = await fetch(avatarSrc);
          const blob = await response.blob();

          // Create filename for the avatar
          profilePicFilename = `avatar-${selectedAvatar + 1}.png`;

          // Create a file from the blob with the expected filename
          const avatarFile = new File([blob], profilePicFilename, {
            type: blob.type || "image/png",
          });

          formDataPayload.append("files", avatarFile, profilePicFilename);
          console.log(
            `Selected avatar ${selectedAvatar + 1} added as file:`,
            profilePicFilename
          );
        } catch (error) {
          console.error("Failed to fetch selected avatar:", error);
          setError("Failed to load selected avatar. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // Prepare user profile details with filename reference
      const userProfileDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        businessUnit: formData.businessUnit,
        managerName: formData.managerName,
      };

      // Add profilePic filename if there's a file
      if (profilePicFilename) {
        userProfileDetails.profilePic = profilePicFilename;
      }

      // Append user profile details as JSON string
      formDataPayload.append(
        "userProfileDetails",
        JSON.stringify(userProfileDetails)
      );

      for (let [key, value] of formDataPayload.entries()) {
        if (value instanceof File) {
          console.log(key, ":", value.name, value.type, value.size + " bytes");
        } else {
          console.log(key, ":", value);
        }
      }

      console.log("userProfileDetails:", userProfileDetails);

      await updateProfile({
        body: formDataPayload,
        authToken: session?.accessToken,
      });
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const profilePics = [
    Profile1,
    Profile2,
    Profile3,
    Profile4,
    Profile5,
    Profile6,
  ];
  const avatars = Array(profilePics.length).fill(null);

    useEffect(() => {
      getProfile(session?.accessToken);
    }, [session]);
  

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-custom flex flex-col">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-2xl bg-black bg-opacity-10 border border-neutral-700 rounded-[16px] w-[680px]">
            <CardContent className="p-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-800 rounded-full p-4">
                  {formData?.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt={`Profile`}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-semibold text-white mb-2">
                  Update your profile
                </h1>
                <p className="text-gray-400 text-sm">
                  Update your profile information and picture
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-6">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Main Tabs */}
              <Tabs
                value={activeMainTab}
                onValueChange={setActiveMainTab}
                className="mb-8"
              >
                <TabsList className="grid w-full grid-cols-2 h-[37px] px-1 bg-white bg-opacity-10 mb-6">
                  <TabsTrigger className="h-[29px]" value="details">
                    Details
                  </TabsTrigger>
                  <TabsTrigger className="h-[29px]" value="picture">
                    Profile Picture
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-300 text-sm"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[14px]"
                        placeholder="Enter first name"
                        required
                        disabled={isLoading || updateProfileProps.isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-gray-300 text-sm"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[14px]"
                        placeholder="Enter last name"
                        required
                        disabled={isLoading || updateProfileProps.isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-gray-300 text-sm">
                        Gender
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px]">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="O">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300 text-sm">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[14px]"
                        placeholder="Enter phone number"
                        disabled={isLoading || updateProfileProps.isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="jobTitle"
                        className="text-gray-300 text-sm"
                      >
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          handleInputChange("jobTitle", e.target.value)
                        }
                        className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[14px]"
                        placeholder="Enter job title"
                        disabled={isLoading || updateProfileProps.isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="businessUnit"
                        className="text-gray-300 text-sm"
                      >
                        Business Unit
                      </Label>
                      <Input
                        id="businessUnit"
                        type="text"
                        value={formData.businessUnit}
                        onChange={(e) =>
                          handleInputChange("businessUnit", e.target.value)
                        }
                        className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[14px]"
                        placeholder="Enter business unit"
                        disabled={isLoading || updateProfileProps.isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="managerName"
                      className="text-gray-300 text-sm"
                    >
                      Manager Name
                    </Label>
                    <Input
                      id="managerName"
                      type="text"
                      value={formData.managerName}
                      onChange={(e) =>
                        handleInputChange("managerName", e.target.value)
                      }
                      className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[14px]"
                      placeholder="Enter manager name"
                      disabled={isLoading || updateProfileProps.isLoading}
                    />
                  </div>
                </TabsContent>

                {/* Profile Picture Tab */}
                <TabsContent value="picture" className="space-y-6">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Profile Picture
                    </h3>

                    {/* Picture Upload/Select Tabs */}
                    <Tabs defaultValue="upload" className="mb-6">
                      <TabsList className="grid w-full grid-cols-2 h-[37px] px-1 bg-white bg-opacity-10">
                        <TabsTrigger
                          className="h-[29px]"
                          value="upload"
                          onClick={() => setMode("upload")}
                        >
                          Upload
                        </TabsTrigger>
                        <TabsTrigger
                          className="h-[29px]"
                          value="select"
                          onClick={() => setMode("select")}
                        >
                          Select
                        </TabsTrigger>
                      </TabsList>

                      <div className="pb-4 pt-6 px-1">
                        <hr className="border-[0.3px] border-[#454549]" />
                      </div>

                      <TabsContent value="upload">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-[16px] bg-white bg-opacity-10 p-8 text-center transition-colors",
                            dragActive
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-gray-700 hover:border-gray-600"
                          )}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-300 mb-2 font-semibold">
                            Drag & drop file here to upload
                          </p>
                          <p className="text-gray-500 text-sm mb-4">
                            JPEG, PNG and SVG
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button
                            variant="secondary"
                            className="bg-transparent font-bold w-full border-2 rounded-[8px] text-gray-300 hover:bg-white hover:bg-opacity-30 hover:text-white"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                          >
                            Browse File
                          </Button>
                          {selectedFile && (
                            <p className="text-green-400 text-sm mt-2">
                              Selected: {selectedFile.name}
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="select">
                        <div className="grid grid-cols-5 gap-4">
                          {avatars.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => handleAvatarSelect(i)}
                              className={cn(
                                "aspect-square rounded-full border-2 hover:bg-gray-700 transition-colors flex items-center justify-center overflow-hidden",
                                selectedAvatar === i
                                  ? "border-purple-500 bg-purple-500/20"
                                  : "border-white border-opacity-60"
                              )}
                            >
                              <img
                                src={profilePics[i].src || profilePics[i]}
                                alt={`Profile ${i + 1}`}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={handleCancel}
                  disabled={isLoading || updateProfileProps.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant={"primary"}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleSubmit}
                  disabled={isLoading || updateProfileProps.isLoading}
                >
                  {isLoading || updateProfileProps.isLoading
                    ? "Updating..."
                    : "Update Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="p-6 bg-gradient-to-b from-transparent to-purple-900/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-white text-opacity-40">
            <div>© 2024 Spacece. All rights reserved.</div>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link
                href="/privacy"
                className="hover:text-purple-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-purple-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-purple-500 transition-colors"
              >
                Cookies Settings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}

