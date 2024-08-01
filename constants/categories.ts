import { Category } from "@prisma/client";

export const categoriesMap: Record<Category, { label: string }> = {
  Bug: { label: "Bug" },
  Enhancement: { label: "Enhancement" },
  Feature: { label: "Feature" },
  UI: { label: "UI" },
  UX: { label: "UX" },
};
