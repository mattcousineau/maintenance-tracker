import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import RequestActions from "./RequestActions";
import RequestTable, { columnNames, RequestQuery } from "./RequestTable";

interface Props {
  searchParams: RequestQuery;
}
const Requests = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const where = { status }; //we were duplicating {where: status} below
  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const requests = await prisma.request.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const requestCount = await prisma.request.count({ where });

  return (
    <Flex direction="column" gap="3">
      <RequestActions />
      <RequestTable searchParams={searchParams} requests={requests} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={requestCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request Tracker - Request List",
  description: "View all project requests",
};

export default Requests;
