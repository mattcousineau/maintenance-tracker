"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { requestSchema } from "@/app/validationschemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Request } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

//Disable SSR for loading markdown editor
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type RequestFormData = z.infer<typeof requestSchema>;
/* 
interface RequestForm {
  title: string;
  description: string;
} */

const RequestForm = ({ request }: { request?: Request }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  //Abstract the inline function into it's own function looks cleaner to me
  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (request) {
        await axios.patch("/api/requests/" + request.id, data);
      } else {
        await axios.post("/api/requests", data);
      }
      router.push("/requests/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input
            defaultValue={request?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>
        {/* we can handle this present error condition in ErrorMessage Component:
        {errors.title && <ErrorMessage> {errors.title.message}</ErrorMessage>} */}
        <ErrorMessage> {errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={request?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field}></SimpleMDE>
          )}
        />
        {/* We can handle this present error condition in ErrorMessage component:
         {errors.description && (
          
        )} */}
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {request ? "Update Request" : "Submit New Request"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default RequestForm;
