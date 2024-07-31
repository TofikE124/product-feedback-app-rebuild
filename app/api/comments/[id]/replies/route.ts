import prisma from "@/prisma/client";
import { delay } from "@/utils/delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
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

  const replies = await prisma.comment.findMany({
    where: { parentId: id },
    include: { user: true, replies: { select: { _count: true } } },
  });

  return NextResponse.json(replies, { status: 200 });
}