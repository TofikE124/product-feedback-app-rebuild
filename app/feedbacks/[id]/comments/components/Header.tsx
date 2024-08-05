import Button from "@/components/Button";
import GoBack from "@/components/GoBack";
import Logo from "@/components/Logo";
import { useIsOwnFeedback } from "@/hooks/useIsOwnFeedback";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  feedbackId?: string;
}

const Header = ({ feedbackId }: HeaderProps) => {
  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-2 items-center w-full mb-9 h-[45px]">
        <div>
          <GoBack></GoBack>
        </div>
        <Link href="/feedbacks" className="lgmd:justify-self-center sm:hidden">
          <Logo></Logo>
        </Link>
        <div className="w-fit justify-self-end">
          {feedbackId ? (
            <EditFeedback feedbackId={feedbackId}></EditFeedback>
          ) : null}
        </div>
      </div>
    </>
  );
};

interface EditFeedbackProps {
  feedbackId: string;
}

const EditFeedback = ({ feedbackId }: EditFeedbackProps) => {
  const { data: isOwn, fetchStatus } = useIsOwnFeedback(feedbackId);
  const router = useRouter();

  return isOwn ? (
    <Button
      onClick={() => {
        router.push(`/feedbacks/${feedbackId}/edit`);
        router.refresh();
      }}
      color="dark-sky-blue"
    >
      Edit Feedback
    </Button>
  ) : null;
};

export default Header;
