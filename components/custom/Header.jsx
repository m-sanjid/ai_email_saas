"use client";
import Image from "next/image";
import React from "react";
import { useUserDetail } from "@/app/provider";
import SignInButton from "./SignInButton";
import { Button } from "../ui/button";
import Link from "next/link";

function Header() {
  const { userDetail, setUserDetail } = useUserDetail();
  return (
    <div className="flex justify-between items-center p-4 shadow-sm px-10">
      <Link href={"/"} className="cursor-pointer">
        <Image src={"/logo.svg"} alt="logo" width={50} height={30} />
      </Link>
      <div>
        {userDetail?.email ? (
          <div className="flex gap-3 items-center">
            <Link href={"/dashboard"}>
              <Button>Dashboard</Button>
            </Link>
            <Image
              src={userDetail?.picture}
              alt="user"
              width={40}
              height={40}
            />
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
}

export default Header;
