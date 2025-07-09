import RequestStatusBadge from "@/app/components/RequestStatusBadge";
import { Request } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const RequestDetails = ({ request }: { request: Request }) => {
  return (
    <div>
      <Heading className="request-heading">{request.title}</Heading>
      <Flex className="space-x-3 request-meta" my="2">
        <RequestStatusBadge status={request.status} />
        <Text>{request.createdAt.toDateString()}</Text>
      </Flex>
      <Card
        className="prose max-w-full glass-card request-description-card"
        mt="4"
      >
        <ReactMarkdown>{request.description}</ReactMarkdown>
      </Card>
    </div>
  );
};

export default RequestDetails;
