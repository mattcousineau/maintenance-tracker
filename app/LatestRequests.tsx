import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { RequestStatusBadge } from "./components";

const LatestRequests = async () => {
  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true, //eager loading
    },
  });

  return (
    <Card>
      <Heading size="4" mb="5">
        Recent Requests
      </Heading>
      <Table.Root>
        <Table.Body>
          {requests.map((request) => (
            <Table.Row key={request.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column" align="start" gap="2">
                    <Link href={`/requests/${request.id}`}>
                      {request.title}
                    </Link>
                    <RequestStatusBadge status={request.status} />
                  </Flex>
                  {request.assignedToUser && (
                    <Avatar
                      src={request.assignedToUser.image!}
                      fallback="?"
                      size="2"
                      radius="full"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestRequests;
