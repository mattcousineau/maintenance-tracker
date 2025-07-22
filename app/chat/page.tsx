"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button, TextField } from "@radix-ui/themes";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { socket } from "../../socket";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { EmojiPicker } from "frimousse";
import React, {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

const formSchema = z.object({
  userMessage: z
    .string()
    .min(1, {
      message: "Message must be at least 1 character.",
    })
    .max(115, { message: "Message must be under 115 characters." }),
});

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState(new Map<string, string>());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userName, setUsername] = useState("Matt");
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userMessage: "",
    },
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    sendMessage(data.userMessage);
    form.reset();
  };

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
      console.log(">***********", file);

      socket.emit("upload", file, (status: string) => {
        console.log(status);
      });
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <div>
            <ScrollArea className="h-150 w-250 rounded-md border">
              <div className="p-4" ref={chatContainerRef}>
                <h4 className="mb-4 text-sm leading-none font-medium">
                  Beginning of Conversation
                </h4>
                {Array.from(messages.entries()).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <div className="text-sm">{value}</div>
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-between mt-3">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full max-w-sm items-center space-x-2"
              >
                <TextField.Root>
                  <TextField.Input
                    autoComplete="off"
                    {...form.register("userMessage")}
                    type="text"
                    placeholder="Enter text"
                  />
                </TextField.Root>
                <Button type="submit">Submit</Button>
                <Popover onOpenChange={setIsOpen} open={isOpen}>
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
                </Popover>
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
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
