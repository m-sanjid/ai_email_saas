"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";

function SignInButton() {
  const CreateUser = useMutation(api.user.CreateUser);
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        console.log(tokenResponse);

        const { data: user } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: "Bearer " + tokenResponse?.access_token },
          },
        );

        // Save to DB
        const result = await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
        });
        console.log("Convex response:", result);

        const userDetail = { ...user, _id: result?.id ?? result };
        console.log(userDetail._id, "hi");

        if (typeof window !== "undefined") {
          localStorage.setItem("userDetail", JSON.stringify(userDetail));
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) =>
      console.log("Google login error:", errorResponse),
  });

  return (
    <div>
      <Button onClick={googleLogin} disabled={loading}>
        {loading ? "Signing in..." : "Get Started"}
      </Button>
    </div>
  );
}

export default SignInButton;
