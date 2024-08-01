import prisma from "@/prisma/client";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { SortingDirection, SortingProperty } from "@/types/Sorting";
import { Category, Feedback, Prisma, Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

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

  let orderBy: Prisma.FeedbackOrderByWithRelationInput = {};

  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection") as SortingDirection;
  const category = searchParams.get("category") as Category;

  if (sortBy && sortDirection) {
    orderBy =
      sortBy == SortingProperty.UP_VOTES
        ? { upVotes: { _count: sortDirection } }
        : sortBy == SortingProperty.COMMENTS
        ? { comments: { _count: sortDirection } }
        : {};
  }

  const feedbaks = await prisma.feedback.findMany({
    include: {
      upVotes: { select: { id: true } },
      comments: { select: { id: true } },
    },
    orderBy,
    where: { category: { equals: category ?? undefined } },
  });

  return NextResponse.json(feedbaks, {
    status: 200,
  });
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

  const { category, description, title, status } = body;

  const feedback = await prisma.feedback.create({
    data: {
      title,
      description,
      category: category as Category,
      status: status as Status,
      userId: user.id,
    },
  });

  return NextResponse.json({ feedback }, { status: 200 });
}
