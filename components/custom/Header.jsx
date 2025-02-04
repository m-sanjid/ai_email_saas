"use client";
import Image from "next/image";
import React from "react";
import { useUserDetail } from "@/app/provider";
import SignInButton from "./SignInButton";
import { Button } from "../ui/button";

function Header() {
  const { userDetail, setUserDetail } = useUserDetail();
  return (
    <div className="flex justify-between items-center p-4 shadow-sm px-10">
      <Image src={"/logo.svg"} alt="logo" width={50} height={30} />
      <div>
        {userDetail?.email ? (
          <div className="flex gap-3 items-center">
            <Button>Dashboard</Button>
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
