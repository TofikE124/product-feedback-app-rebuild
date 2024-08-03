import Button from "@/components/Button";
import GoBack from "@/components/GoBack";
import { useIsOwnFeedback } from "@/hooks/useIsOwnFeedback";
import Link from "next/link";

interface HeaderProps {
  feedbackId?: string;
}

const Header = ({ feedbackId }: HeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between w-full mb-9 h-[45px]">
        <GoBack></GoBack>
        {feedbackId ? (
          <EditFeedback feedbackId={feedbackId}></EditFeedback>
        ) : null}
      </div>
    </>
  );
};

interface EditFeedbackProps {
  feedbackId: string;
}

const EditFeedback = ({ feedbackId }: EditFeedbackProps) => {
  const { data: isOwn, fetchStatus } = useIsOwnFeedback(feedbackId);
  return isOwn ? (
    <Link href={`/feedbacks/${feedbackId}/edit`}>
      <Button color="dark-sky-blue">Edit Feedback</Button>
    </Link>
  ) : null;
};

export default Header;
