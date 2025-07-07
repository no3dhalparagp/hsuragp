"use client";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";

const ImageUploadBtn = () => {
  return (
    <UploadButton
      endpoint="profilePicture"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default ImageUploadBtn;
