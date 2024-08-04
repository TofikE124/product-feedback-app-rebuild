import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Icon from "@/components/Icon";
import EmailIcon from "/public/shared/icon-email.svg";
import PasswordIcon from "/public/shared/icon-password.svg";
import EyeOpenedIcon from "/public/shared/icon-eye-opened.svg";
import EyeClosedIcon from "/public/shared/icon-eye-closed.svg";
import UserIcon from "/public/shared/icon-user.svg";

import { useState } from "react";
import PasswordEye from "@/components/PasswordEye";

type SignupSchemaType = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  redirect?: boolean;
  callbackUrl?: string;
  onLoginClick?: () => void;
}

const SignUpForm = ({
  callbackUrl = "/",
  redirect = true,
  onLoginClick,
}: SignUpFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassowrd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignupSchemaType) => {
    if (data.password != data.repeatedPassword) {
      setError("repeatedPassword", { message: "Passwords don't match" });
      return;
    }

    const signUpPromise = axios.post("/api/user", data);

    toast
      .promise(signUpPromise, {
        loading: "Signing Up",
        error: (error: AxiosError<{ message: string }>) => {
          return error.response?.data?.message ?? "Couldn't sign up";
        },
        success: "Signed Up Successfully",
      })
      .then((response) => {
        signIn("credentials", {
          redirect,
          email: data.email,
          password: data.password,
          callbackUrl,
        });
      })
      .catch((err) => {});
  };

  const handleLoginClick = () => {
    if (onLoginClick) onLoginClick();
    else router.replace("/login");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-10 rounded-2xl w-full"
    >
      <h1 className="h1 text-navy-blue">Create Account</h1>
      <p className="body-m text-steel-blue mt-2">
        Let’s get you started sharing your links!
      </p>
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="body3  text-steel-blue">Username</p>
          <TextField
            {...register("name")}
            placeholder="e.g alex"
            errorMessage={errors.name?.message}
            icon={UserIcon}
          ></TextField>
        </div>
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
          <p className="body3  text-steel-blue">Create Password</p>
          <div className="relative w-full flex items-center gap-2">
            <TextField
              {...register("password")}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              errorMessage={errors.password?.message}
              icon={PasswordIcon}
            ></TextField>
            <PasswordEye
              showPassword={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            ></PasswordEye>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="body3  text-steel-blue">Confirm Password</p>
          <div className="relative w-full flex items-center gap-2">
            <TextField
              {...register("repeatedPassword")}
              placeholder="Enter your password"
              type={showRepeatPassword ? "text" : "password"}
              errorMessage={errors.repeatedPassword?.message}
              icon={PasswordIcon}
            ></TextField>
            <PasswordEye
              showPassword={showRepeatPassword}
              onClick={() => setShowRepeatPassowrd(!showRepeatPassword)}
            ></PasswordEye>
          </div>
        </div>
        <p className="body3 font-normal text-navy-blue">
          Password must contain at least 8 characters
        </p>
        <Button color="navy-blue">Create new account</Button>

        <p className="body1 text-steel-blue text-center">
          {"Don't have an account"} ?{" "}
          <button
            type="button"
            className="text-electric-violet no-underline hover:underline sm:block"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
