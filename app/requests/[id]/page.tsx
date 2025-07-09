import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { cache } from "react";
import AssigneeSelect from "./AssigneeSelect";
import DeleteRequestButton from "./DeleteRequestButton";
import EditRequestButton from "./EditRequestButton";
import RequestDetails from "./RequestDetails";

interface Props {
  params: { id: string }; //all values in a route are string values by default
}

const fetchUser = cache((requestId: number) =>
  prisma.request.findUnique({ where: { id: requestId } })
);
const RequestDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const request = await fetchUser(parseInt(params.id));

  if (!request) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md: col-span-4">
        <RequestDetails request={request} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect request={request} />
            <EditRequestButton requestId={request.id} />
            <DeleteRequestButton requestId={request.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const request = await fetchUser(parseInt(params.id));

  return {
    title: request?.title,
    description: "Details of request" + request?.id,
  };
}

export default RequestDetailPage;
