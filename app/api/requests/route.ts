import authOptions from "@/app/auth/authOptions";
import { requestSchema } from "@/app/validationschemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //repetitive, but secures our API individually instead of blanket middleware.ts matcher security
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = requestSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  //destructured this so we don't need to assign body.* variables (obv., but note to self)
  const { title, description } = body;
  const newRequest = await prisma.request.create({
    data: { title, description },
  });

  return NextResponse.json(newRequest, { status: 201 });
}
