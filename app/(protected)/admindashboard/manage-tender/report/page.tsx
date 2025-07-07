// Example parent page usage
import { WorkDetails } from "./WorkDetails";

export default function ParentPage({
  searchParams,
}: {
  searchParams: { nitNo?: string };
}) {
  return <WorkDetails nitNo={searchParams.nitNo} />;
}
