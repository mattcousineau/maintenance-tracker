"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteRequestButton = ({ requestId }: { requestId: number }) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const deleteRequest = async () => {
    try {
      setDeleting(true);
      await axios.delete("/api/requests/" + requestId);
      router.push("/requests");
      router.refresh();
    } catch (error) {
      setDeleting(false);
      setError(true);
    }
  };

  return (
    <div>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button>Delete Request</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this request? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex className="mt-4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="soft">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deleteRequest} disabled={isDeleting}>
                Delete Request
                {isDeleting && <Spinner />}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error with deletion</AlertDialog.Title>
          <AlertDialog.Description>
            This request could not be deleted.
          </AlertDialog.Description>
          <Button
            className="mt-3"
            color="gray"
            variant="soft"
            onClick={() => {
              setError(false);
            }}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default DeleteRequestButton;
