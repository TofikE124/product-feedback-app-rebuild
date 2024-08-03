import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const replies = await prisma.comment.findMany({
    where: { parentId: id },
    include: { user: true, replies: { select: { _count: true } } },
  });

  return NextResponse.json(replies, { status: 200 });
}
