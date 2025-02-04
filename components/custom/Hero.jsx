import React from "react";
import { Button } from "../ui/button";
import SignInButton from "./SignInButton";

function Hero() {
  return (
    <div className="px-10 md:px-28 lg:px-44 xl:px-56 flex mt-24 flex-col items-center">
      <h2 className="font-extrabold text-center text-5xl">
        AI-Powered <span className="text-primary">Email Templates</span>
      </h2>
      <p className="text-center mt-4">
        Impress your clients with AI super-powered Email Templates.
      </p>

      <div className="flex gap-5 mt-6">
        <Button variant="outline">Try Demo</Button>
        <SignInButton />
      </div>
    </div>
  );
}

export default Hero;
