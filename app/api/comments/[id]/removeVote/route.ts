import prisma from "@/prisma/client";
import { delay } from "@/utils/delay";
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

  const myVote = await prisma.commentVote.findFirst({
    where: { commentId: id, userId: user.id },
  });

  if (!myVote)
    return NextResponse.json(
      { message: "You don't have any votes on that comment" },
      { status: 400 }
    );
  else {
    const deletedVote = await prisma.commentVote.delete({
      where: { id: myVote.id },
    });
    return NextResponse.json(deletedVote, { status: 200 });
  }
}
