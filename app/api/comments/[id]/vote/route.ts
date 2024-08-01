import prisma from "@/prisma/client";
import { commentVoteSchema } from "@/schemas/commentVoteSchema";
import { VoteType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function POST(request: NextRequest, { params: { id } }: Props) {
  type voteCommentType = z.infer<typeof commentVoteSchema>;
  const body = (await request.json()) as voteCommentType;

  const validation = commentVoteSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

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

  const { voteType } = body;

  const vote = await prisma.commentVote.findFirst({
    where: { commentId: id, userId: user.id, voteType: voteType as VoteType },
  });

  if (vote) {
    return NextResponse.json(
      "You have already votes for this comment with this voteType",
      { status: 400 }
    );
  } else {
    await prisma.commentVote.deleteMany({
      where: { commentId: id, userId: user.id },
    });

    const newVote = await prisma.commentVote.create({
      data: { commentId: id, userId: user.id, voteType: voteType as VoteType },
    });

    return NextResponse.json(newVote, { status: 200 });
  }
}
