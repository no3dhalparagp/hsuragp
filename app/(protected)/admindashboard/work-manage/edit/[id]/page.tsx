import EditActionPlanForm from "@/components/form/edit-action-plan-form";
import Modal from "@/components/Modal";
import { db } from "@/lib/db";
import { ActionPlanDetailsProps } from "@/schema/actionplan";
const page = async ({ params }: { params: { id: string } }) => {
  const actionplanform = (await db.approvedActionPlanDetails.findUnique({
    where: {
      id: params.id,
    },
  })) as ActionPlanDetailsProps;
  return (
    <Modal>
      <EditActionPlanForm initialData={actionplanform} id={params.id} />
    </Modal>
  );
};

export default page;
