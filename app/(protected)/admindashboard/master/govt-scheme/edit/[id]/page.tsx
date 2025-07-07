import SchemeUploadForm from "@/components/form/SchemeUploadForm";
import React from "react";

const editpage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <SchemeUploadForm schemeId={params.id} />
    </div>
  );
};

export default editpage;
