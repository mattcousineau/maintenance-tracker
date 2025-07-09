import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import RequestForm from "../../_components/RequestForm";

interface Props {
  params: { id: string }; //all values in a route are string values by default
}

const EditRequestPage = async ({ params }: Props) => {
  const request = await prisma.request.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!request) return notFound();

  return <RequestForm request={request} />;
};

export default EditRequestPage;
