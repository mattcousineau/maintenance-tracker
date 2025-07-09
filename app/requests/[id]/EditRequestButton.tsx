import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditRequestButton = ({ requestId }: { requestId: number }) => {
  return (
    <div>
      {" "}
      <Button>
        <Pencil2Icon />
        <Link href={`/requests/${requestId}/edit`}>Edit Request</Link>
      </Button>
    </div>
  );
};

export default EditRequestButton;
