import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import RequestFilter from "./RequestFilter";

const RequestActions = () => {
  return (
    <Flex justify="between">
      <RequestFilter></RequestFilter>
      <Button>
        <Link href="/requests/new">New Request</Link>
      </Button>
    </Flex>
  );
};

export default RequestActions;
