"use client";
import Logo from "@/components/Logo";
import Link from "next/link";

import GoBack from "@/components/GoBack";
import SignUpForm from "@/forms/SignUpForm";

const page = () => {
  return (
    <div className="grid h-screen w-screen">
      <div className="size-full flex flex-col items-center justify-center">
        <div className="lgmd:w-[450px] sm:w-[80%] sm:max-w-[400px] mx-auto">
          <div className="relative w-full grid grid-cols-3">
            <GoBack navigateType="history"></GoBack>
            <Link href="/" className="block">
              <Logo></Logo>
            </Link>
            <div></div>
          </div>
          <div className="mt-14">
            <SignUpForm callbackUrl=""></SignUpForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
