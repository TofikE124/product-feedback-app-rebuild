import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function POST(request: NextRequest, { params: { id } }: Props) {
  const session = await getServerSession();

  if (!session?.user)
    return NextResponse.json(
      { message: "You are not allowed to do that" },
      { status: 401 }
    );

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user)
    return NextResponse.json(
      { message: "You are not allowed to do that" },
      { status: 401 }
    );

  const upvote = await prisma.upVote.findFirst({
    where: { feedbackId: id, userId: user.id },
  });

  if (!upvote) {
    await prisma.upVote.create({ data: { feedbackId: id, userId: user.id } });
    return NextResponse.json(
      { message: "Upvoted Successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "You already upvoted" },
      { status: 400 }
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
