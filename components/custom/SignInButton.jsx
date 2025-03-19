"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"; 
import { Button } from "../ui/button";
import { GoogleIcon } from "./icons";

function SignInButton({ size = "small", text = "default" }) {
  const { data: session } = useSession();
  const createUser = useMutation(api.user.CreateUserWithGoogle); 
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const saveUserToConvex = async () => {
      if (session?.user) {
        try {
          const user = session.user;
          await createUser({
            name: user.name || "",
            email: user.email || "",
            picture: user.image || "",
          });
          console.log("User saved to Convex database");
        } catch (error) {
          console.error("Error saving user to Convex:", error);
        }
      }
    };
    
    if (session) {
      saveUserToConvex();
    }
  }, [session, createUser]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Error during Google login:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`px-8 dark:bg-neutral-100 ${size === "big" ? "md:w-[20rem]" : ""}`}
      >
        {text === "google" ? (
          loading ? (
            "Signing in..."
          ) : (
            <span className="flex gap-2 items-center">
              <GoogleIcon /> Continue with Google
            </span>
          )
        ) : (
          "Get Started"
        )}
      </Button>
    </div>
  );
}

export default SignInButton;