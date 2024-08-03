import prisma from "@/prisma/client";
import { signUpSchema } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  type signUpSchemaType = z.infer<typeof signUpSchema>;
  const body = await request.json();

  const validation = signUpSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const { email, password, name } = body as signUpSchemaType;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { name }] },
  });
  if (user)
    if (user?.email == email)
      return NextResponse.json(
        { message: "User with this emaill already exists" },
        { status: 400 }
      );
    else
      return NextResponse.json(
        { message: "User with this Username already exists" },
        { status: 400 }
      );

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, hashedPassword, name },
  });
  return NextResponse.json(newUser, { status: 201 });
}
