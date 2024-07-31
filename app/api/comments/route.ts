import prisma from "@/prisma/client";
import { createCommentSchema } from "@/schemas/createCommentSchema";
import { delay } from "@/utils/delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  await delay(3000);
  type createCommentType = z.infer<typeof createCommentSchema>;
  const body = (await request.json()) as createCommentType;

  const validation = createCommentSchema.safeParse(body);
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

  const { content, feedbackId } = body;

  const newComment = await prisma.comment.create({
    data: {
      content,
      feedbackId: feedbackId,
      userId: user.id,
    },
  });

  return NextResponse.json(newComment, { status: 200 });
}
