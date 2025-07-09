import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: Status;
}

const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" }
> = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  CLOSED: { label: "Closed", color: "green" },
};
const RequestStatusBadge = ({ status }: Props) => {
  //can also destructure without creating Props interface for single property props
  //({ status }: { status: Status}) => {}
  return (
    <div>
      <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
    </div>
  );
};

export default RequestStatusBadge;
