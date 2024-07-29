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
    return NextResponse.json(
      { message: "You have not upvoted this feedback yet" },
      { status: 400 }
    );
  } else {
    await prisma.upVote.delete({ where: { id: upvote.id } });
    return NextResponse.json(
      { message: "Upvoted Deleted Successfully" },
      { status: 200 }
    );
  }
}
