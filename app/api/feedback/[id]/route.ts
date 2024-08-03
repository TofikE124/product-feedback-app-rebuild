import prisma from "@/prisma/client";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { delay } from "@/utils/delay";
import { Category, Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: {
      upVotes: { select: { id: true } },
      comments: { select: { id: true } },
    },
  });
  if (!feedback)
    return NextResponse.json(
      { message: "feedback not found" },
      { status: 404 }
    );
  return NextResponse.json(feedback, { status: 200 });
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  type feedbackType = z.infer<typeof feedbackSchema>;
  const body = (await request.json()) as feedbackType;

  const validation = feedbackSchema.safeParse(body);

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

  const editedFeedback = await prisma.feedback.update({
    where: { id },
    data: {
      ...body,
      category: body.category as Category,
      status: body.status as Status,
    },
  });

  return NextResponse.json(editedFeedback, { status: 200 });
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
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

  const deletedFeedback = await prisma.feedback.delete({ where: { id } });

  if (!deletedFeedback)
    return NextResponse.json(
      { message: "Feedback Not Found" },
      { status: 404 }
    );
  return NextResponse.json(deletedFeedback, { status: 200 });
}
