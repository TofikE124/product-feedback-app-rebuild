import prisma from "@/prisma/client";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

interface Props {
  params: { id: string };
}

const layout = ({ children }: PropsWithChildren) => {
  return children;
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const feedback = await prisma.feedback.findUnique({ where: { id } });

  return {
    title: `${feedback?.title} | Editing`,
    description: `editing ${feedback?.title} page`,
  };
}

export default layout;
