import prisma from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import RequestChart from "./RequestChart";
import RequestSummary from "./RequestSummary";
import LatestRequests from "./LatestRequests";
import RequestTest from "./RequestTest";

export default async function Home() {
  const open = await prisma.request.count({ where: { status: "OPEN" } });
  const inProgress = await prisma.request.count({
    where: { status: "IN_PROGRESS" },
  });
  const closed = await prisma.request.count({ where: { status: "CLOSED" } });

  return (
    <div>
      <Grid gap="5" columns={"1"}>
        <RequestTest />
      </Grid>
      <Grid gap="5" columns={{ initial: "1", md: "2" }}>
        <LatestRequests />
        <Flex direction="column" gap="5">
          <RequestSummary open={open} inProgress={inProgress} closed={closed} />
          <RequestChart open={open} inProgress={inProgress} closed={closed} />
        </Flex>
      </Grid>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Request Tracker - Dashboard",
  description: "View a summary of project requests",
};
