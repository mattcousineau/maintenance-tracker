import { RequestStatusBadge } from "@/app/components";
import { Request, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export interface RequestQuery {
  status: Status;
  orderBy: keyof Request;
  page: string;
}

interface Props {
  searchParams: RequestQuery;
  requests: Request[];
}

const RequestTable = ({ searchParams, requests }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: { ...searchParams, orderBy: column.value },
                }}
              >
                {column.label}
                {column.value === searchParams.orderBy && (
                  <ArrowUpIcon className="inline" />
                )}
              </NextLink>
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {requests.map((request) => (
          <Table.Row key={request.id}>
            <Table.Cell>
              <Link href={`/requests/${request.id}`}>{request.title}</Link>

              <div className="block md:hidden">
                {" "}
                <RequestStatusBadge status={request.status} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <RequestStatusBadge status={request.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {request.createdAt.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: { label: string; value: keyof Request; className?: string }[] = [
  { label: "Request", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
];

export const columnNames = columns.map((column) => column.value);

export default RequestTable;
