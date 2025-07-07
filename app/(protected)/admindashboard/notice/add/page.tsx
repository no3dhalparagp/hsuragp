import NoticeForm from "@/components/form/notice-form";

export default function NoticePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Notice</h1>
        <NoticeForm />
      </div>
    </div>
  );
}
