import prisma from "@/prisma/client";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { Category, Feedback } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
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

  const feedbaks = await prisma.feedback.findMany({
    include: {
      upVotes: { select: { id: true } },
      comments: { select: { id: true } },
    },
  });
  return NextResponse.json(feedbaks, { status: 200 });
}

export async function POST(request: NextRequest) {
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

  const { category, description, title } = body;

  const feedback = await prisma.feedback.create({
    data: {
      title,
      description,
      category: category as Category,
      userId: user.id,
    },
  });

  return NextResponse.json({ feedback }, { status: 200 });
}
