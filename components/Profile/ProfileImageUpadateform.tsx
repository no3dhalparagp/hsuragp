"use client";

import { removeProfilePreviwImage } from "@/action/removeHeroImage";
import { userProfileImage, userProfileUpdate } from "@/action/userinfo";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UploadDropzone, UploadButton } from "@/utils/uploadthing";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

const ProfileImageUpadateform = () => {
  const [imagurl, setimagurl] = useState<string>("");
  const [imagkey, setimagekey] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // Add state to track update process
  const session = useSession();
  const user = useCurrentUser();

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    // Disable the button during update process
    setIsUpdating(true);

    try {
      await userProfileImage(imagurl, imagkey);
      // Reset state after successful update
      setimagurl("");
      setimagekey("");
      session.update();
    } catch (error) {
      console.error("Error updating profile image:", error);
      // Handle error gracefully, e.g., display an error message
    } finally {
      // Re-enable the button after update process completes (whether success or failure)
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    const res = await removeProfilePreviwImage(imagkey);
    if (res?.success) {
      setimagurl("");
      alert("one file is deleted");
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <div className="w-40 h-40 border">
            <Image
              src={imagurl}
              alt="profile"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <button onClick={handleRemove}>
            <MdDelete size={20} />
          </button>
        </div>
        <div className="w-32 mt-3">
          <UploadButton
            endpoint="strictImageAttachment"
            onClientUploadComplete={(res) => {
              setimagurl(res[0].url);
              setimagekey(res[0].key);

              // Do something with the response
            }}
            onUploadError={(error: Error) => {
              console.log(error);
            }}
          />
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileImageUpadateform;
