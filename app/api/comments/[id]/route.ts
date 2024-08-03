import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: true,
      replies: { select: { _count: true } },
    },
  });

  if (!comment)
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });

  return NextResponse.json(comment, { status: 200 });
}
