import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json(false, { status: 200 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  const feedback = await prisma.feedback.findUnique({
    where: { id, userId: user!.id },
  });

  return NextResponse.json(feedback != null, { status: 200 });
}
