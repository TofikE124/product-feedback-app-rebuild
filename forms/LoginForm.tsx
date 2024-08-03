import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { twMerge } from "tailwind-merge";
import EmailIcon from "/public/shared/icon-email.svg";
import GoogleIcon from "/public/shared/icon-google.png";
import PasswordIcon from "/public/shared/icon-password.svg";

type LoginSchemaType = z.infer<typeof loginSchema>;

interface LoginFormProps {
  callbackUrl?: string;
  className?: string;
  onCreateAccountClick?: () => void;
}

const LoginForm = ({
  callbackUrl,
  onCreateAccountClick,
  className,
}: LoginFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const [canLogin, setCanLogin] = useState(true);

  const onSubmit = (data: FieldValues) => {
    if (!canLogin) {
      toast.error("Please wait before logging again");
      return;
    }
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((res) => {
        if (!res?.ok) {
          toast.error("Wrong credentials");
          return;
        }
        toast.success("Logged in Successfully");
        router.push("/");
      })
      .catch((err) => {
        toast.error("Coludn't login");
      });

    loginCountdown();
  };

  const loginCountdown = () => {
    setCanLogin(false);
    setTimeout(() => {
      setCanLogin(true);
    }, 1000);
  };

  const loginWithGoogle = () => {
    signIn("google", { redirect: false, callbackUrl: "/" });
  };

  const handleCreateAccountClick = () => {
    if (onCreateAccountClick) onCreateAccountClick();
    else router.replace("/signup");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge("bg-white p-10 rounded-2xl w-full", className)}
    >
      <h1 className="h1 text-navy-blue">Login</h1>
      <p className="body-m text-steel-blue mt-2">
        Add your details below to get back into the app
      </p>
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="body3  text-steel-blue">Email adress</p>
          <TextField
            {...register("email")}
            placeholder="e.g alex@amil.com"
            errorMessage={errors.email?.message}
            icon={EmailIcon}
          ></TextField>
        </div>
        <div className="flex flex-col gap-1">
          <p className="body3  text-steel-blue">Password</p>
          <TextField
            {...register("password")}
            placeholder="Enter your password"
            type="password"
            errorMessage={errors.password?.message}
            icon={PasswordIcon}
          ></TextField>
        </div>
        <Button color="navy-blue">Login</Button>
        <Button
          color="navy-blue-border"
          onClick={loginWithGoogle}
          type="button"
          variant="text-with-icon"
        >
          <div className="flex w-full items-center justify-center gap-3">
            <Image width={30} height={30} src={GoogleIcon} alt="Google Icon" />
            <span>Login With Google</span>
          </div>
        </Button>
        <p className="body1 text-steel-blue text-center">
          {"Don't have an account"} ?{" "}
          <button
            type="button"
            onClick={handleCreateAccountClick}
            className="text-electric-violet no-underline hover:underline sm:block"
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;