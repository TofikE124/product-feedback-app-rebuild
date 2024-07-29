import prisma from "@/prisma/client";
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
