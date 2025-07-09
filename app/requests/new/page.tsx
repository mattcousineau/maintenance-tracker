import dynamic from "next/dynamic";
import RequestFormSkeleton from "./loading";

const RequestForm = dynamic(
  () => import("@/app/requests/_components/RequestForm"),
  {
    ssr: false,
    loading: () => <RequestFormSkeleton />,
  }
);

const NewRequestPage = () => {
  return <RequestForm />;
};

export default NewRequestPage;
