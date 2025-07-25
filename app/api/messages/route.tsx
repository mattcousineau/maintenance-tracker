import authOptions from "@/app/auth/authOptions";
import { chatMessageSchema } from "@/app/validationschemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //repetitive, but secures our API individually instead of blanket middleware.ts matcher security
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();

  const validation = chatMessageSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }
  const { chatMsg } = body;
  const newMessage = await prisma.chatMessage.create({
    data: { message: chatMsg, createdByUserId: session.user.id },
  });

  return NextResponse.json(newMessage, { status: 201 });
}

export async function GET(request: NextRequest) {
  const chatMessages = await prisma.chatMessage.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(chatMessages);
}
