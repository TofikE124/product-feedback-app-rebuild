import Icon from "@/components/Icon";
import EyeOpenedIcon from "/public/shared/icon-eye-opened.svg";
import EyeClosedIcon from "/public/shared/icon-eye-closed.svg";

interface PasswordEyeProps {
  showPassword: boolean;
  onClick: () => void;
}

const PasswordEye = ({ showPassword, onClick }: PasswordEyeProps) => {
  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer"
      style={{ right: "-12px", transform: "translateX(100%)" }}
    >
      {showPassword ? (
        <Icon
          icon={EyeOpenedIcon}
          color="#3a4374"
          width={24}
          height={24}
        ></Icon>
      ) : (
        <Icon
          icon={EyeClosedIcon}
          color="#3a4374"
          width={24}
          height={24}
        ></Icon>
      )}
    </div>
  );
};

export default PasswordEye;
