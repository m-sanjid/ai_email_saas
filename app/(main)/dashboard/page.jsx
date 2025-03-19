"use client";
import EmailTemplateList from "@/components/custom/EmailTemplateList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Dashboard() {
  return (
    <div>
      <div className="p-10 md:px-28 mt-16 lg:px-40 xl:px-56">
        <div className="flex justify-between items-center mb-20">
          <h2 className="font-bold text-3xl">
            Hello, {userDetail?.name ?? "User"}
          </h2>
          <Link href={"/dashboard/create"}>
            <Button variant="secondary">+ Create New Email Template</Button>
          </Link>
        </div>
        <EmailTemplateList />
      </div>
    </div>
  );
}

export default Dashboard;
