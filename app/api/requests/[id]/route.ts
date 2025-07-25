import authOptions from "@/app/auth/authOptions";
import { patchRequestSchema } from "@/app/validationschemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  //repetitive, but secures our API individually instead of blanket middleware.ts matcher security
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();

  const validation = patchRequestSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const { assignedToUserId, title, description } = body;

  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user)
      return NextResponse.json({ error: "Invalid user." }, { status: 404 });
  }

  const maintRequest = await prisma.request.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!maintRequest) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 404 });
  }

  const updatedRequest = await prisma.request.update({
    where: { id: maintRequest.id },
    data: {
      title,
      description,
      assignedToUserId,
    },
  });

  return NextResponse.json(updatedRequest);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  //repetitive, but secures our API individually instead of blanket middleware.ts matcher security
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const maintRequest = await prisma.request.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!maintRequest) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 404 });
  }

  await prisma.request.delete({
    where: { id: maintRequest.id },
  });

  return NextResponse.json({});
}
