import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  let myVote;
  if (user)
    myVote = await prisma.commentVote.findFirst({
      where: { commentId: id, userId: user.id },
    });

  const votes = await prisma.commentVote.findMany({ where: { commentId: id } });
  return NextResponse.json(
    { votes, myVoteType: myVote?.voteType || null },
    { status: 200 }
  );
}
