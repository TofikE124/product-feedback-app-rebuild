import Button from "@/components/Button";
import { PANELS } from "@/constants/panels";
import { usePanel } from "@/providers/PanelProvider";

const AddCommentGuest = () => {
  const { openPanel } = usePanel();

  return (
    <div className="px-8">
      <Button
        onClick={() => openPanel(PANELS.AUTH_PANEL)}
        color="navy-blue-border"
        className="w-fit"
      >
        + Add a Comment
      </Button>
    </div>
  );
};

export default AddCommentGuest;
