import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const comments = await prisma.comment.findMany({
    where: { feedbackId: id, parentId: null },
    include: {
      user: true,
      replies: { select: { _count: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(comments, { status: 200 });
}
