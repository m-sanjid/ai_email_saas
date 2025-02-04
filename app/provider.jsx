"use client";
import React, { useContext, useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ScreenSizeContext } from "@/context/ScreenSizeContext";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const [userDetail, setUserDetail] = useState();
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    if (typeof window !== undefined) {
      const storage = JSON.parse(localStorage.getItem("userDetail"));
      if (!storage?.email || !storage) {
        //Redirect to home screen
      } else {
        setUserDetail(storage);
      }
    }
  }, []);
  return (
    <ConvexProvider client={convex}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <ScreenSizeContext value={{ screenSize, setScreenSize }}>
            <div>{children}</div>
          </ScreenSizeContext>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </ConvexProvider>
  );
}

export default Provider;

export const useUserDetail = () => useContext(UserDetailContext);

export const useScreenSize = () => useContext(ScreenSizeContext);
