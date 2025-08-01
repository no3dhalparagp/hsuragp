import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  profilePicture: f(["image"]).onUploadComplete((data) =>
    console.log("file", data)
  ),

  //this route take pdf to attch

  pdfUploader: f({ pdf: { maxFileSize: "1MB" } }).onUploadComplete((data) =>
    console.log()
  ),
  // This route takes an attached image OR video
  messageAttachment: f(["image", "video"]).onUploadComplete((data) =>
    console.log("file", data)
  ),

  // Takes ONE image up to 2MB
  strictImageAttachment: f({
    image: { maxFileSize: "128KB", maxFileCount: 1 },
  }).onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
