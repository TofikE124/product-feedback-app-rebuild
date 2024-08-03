"use client";
import Logo from "@/components/Logo";
import Link from "next/link";

import GoBack from "@/components/GoBack";
import LoginForm from "@/forms/LoginForm";

const page = () => {
  return (
    <div className="grid h-screen w-screen">
      <div className="size-full flex flex-col items-center justify-center">
        <div className="lgmd:w-[450px] sm:w-[80%] sm:max-w-[400px] mx-auto">
          <div className="w-full flex items-center">
            <GoBack></GoBack>
            <Link href="/" className="block mx-auto">
              <Logo></Logo>
            </Link>
          </div>
          <div className="mt-14">
            <LoginForm callbackUrl="/"></LoginForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
