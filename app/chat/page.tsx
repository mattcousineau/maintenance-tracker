"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Button, TextField } from "@radix-ui/themes";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { socket } from "../../socket";

import { ChatMessage } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EmojiPicker } from "frimousse";
import React, {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Skeleton from "../components/Skeleton";
import { chatMessageSchema } from "../validationschemas";
import { useSession } from "next-auth/react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState(new Map<string, string>());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userName, setUsername] = useState("Matt");
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<any>(null);

  const { data: message, error, isLoading } = useChatMessages();
  const { data: session } = useSession();

  const { handleSubmit, register, reset } = useForm<
    z.infer<typeof chatMessageSchema>
  >({
    resolver: zodResolver(chatMessageSchema),
  });

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on(
        "upgrade",
        (transport: { name: SetStateAction<string> }) => {
          setTransport(transport.name);
        }
      );
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const addMessage = (key: string, value: string) => {
    const newMessages = new Map(messages);
    newMessages.set(key, value);
    setMessages(newMessages);
  };

  function sendMessage(value: string) {
    const currentDate = new Date();
    let date = format(currentDate, "MM/dd/yyyy HH:mm");
    socket.emit("clt-msg", `[${date}] [${userName}]: ${value}`);
  }

  const onSubmit = handleSubmit(async (data) => {
    sendMessage(data.chatMsg);
    await axios.post("/api/messages", data);

    reset();
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    const handleChatUpdate = (msg: string) => {
      addMessage(crypto.randomUUID(), msg);
    };

    socket.on("chatupdate", handleChatUpdate);

    return () => {
      socket.off("chatupdate", handleChatUpdate);
    };
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]); // Get the first selected file
    }
  };

  const handleUpload = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent default form submission
    if (file) {
      socket.emit("upload", file, (status: string) => {
        console.log(status);
      });
    } else {
      console.log("No file selected.");
    }
  };
  if (isLoading) return <Skeleton />;

  if (error) return null;

  return (
    <div className="">
      <main className="">
        <div>
          <ScrollArea.Root className="h-[525px] w-[1200px] overflow-hidden rounded bg-white shadow-[0_2px_10px] shadow-blackA4">
            <ScrollArea.Viewport className="size-full rounded">
              <div className="p-4" ref={chatContainerRef}>
                <h4 className="mb-4 text-sm leading-none font-medium">
                  Beginning of Conversation
                </h4>
                {message?.map((msg) => (
                  <React.Fragment key={msg.id}>
                    <div className="text-sm">{msg.message}</div>
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-mauve10 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="bg-blackA5" />
          </ScrollArea.Root>

          <div className="flex justify-between mt-3">
            <form
              onSubmit={onSubmit}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <TextField.Root>
                <TextField.Input
                  autoComplete="off"
                  {...register("chatMsg")}
                  type="text"
                  placeholder="Enter text"
                />
              </TextField.Root>
              <Button type="submit">Submit</Button>
              {/*               <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                  <p>😊</p>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                  <EmojiPicker.Root
                    className="h-[342px]"
                    onEmojiSelect={({ emoji }) => {
                      setIsOpen(false);
                      console.log(emoji);
                    }}
                  >
                    <EmojiPicker.Search />
                  </EmojiPicker.Root>
                </PopoverContent>
              </Popover> */}
            </form>
            <form onSubmit={handleUpload}>
              <TextField.Input
                id="uploadedfile"
                type="file"
                onChange={handleFileChange}
              />
              <Button type="submit">Upload</Button>
            </form>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}

const useChatMessages = () =>
  useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: () => axios.get("/api/messages").then((res) => res.data),
    staleTime: 60 * 1000, //60sec
    retry: 3,
  });
