import { Status } from "@prisma/client";

export const roadMapItemMap: Record<
  Status,
  { color: string; label: string; description: string }
> = {
  Planned: {
    color: "#F49F85",
    label: "Planned",
    description: "Ideas prioritized for research ",
  },
  InProgress: {
    color: "#AD1FEA",
    label: "In-Progress",
    description: "Currently being developed",
  },
  Live: { color: "#62BCFA ", label: "Live", description: "Released features" },
};
