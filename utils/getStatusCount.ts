import { Feedback, Status } from "@prisma/client";

export const getStatusCount = (status: Status, feedbacks: Feedback[]) => {
  return feedbacks.reduce((sum, el) => sum + (el.status == status ? 1 : 0), 0);
};
