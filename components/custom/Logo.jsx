"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[60px] h-[20px] bg-gray-300 animate-pulse" />;
  }

  const logo = resolvedTheme === "dark" ? "/darklogo.svg" : "/logo.svg";

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src={logo} alt="Logo" width={40} height={20} />
    </Link>
  );
};

export default Logo;

export const LogoImage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo = resolvedTheme === "dark" ? "/darklogo.svg" : "/logo.svg";
  return mounted ? (
    <Link href="/">
      <Image src={logo} alt="Logo" width={60} height={20} />
    </Link>
  ) : (
    <div className="w-[60px] h-[20px] bg-gray-300 animate-pulse" />
  );
};

export const LogoText = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo = resolvedTheme === "dark" ? "/darklogo.svg" : "/logo.svg";

  if (!mounted) {
    return <div className="h-14 w-16 bg-gray-300 animate-pulse" />;
  }

  return (
    <div className="font-semibold flex items-baseline text-center">
      EM
      <motion.span
        initial={{ y: 20 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="font-medium text-5xl md:text-6xl"
      >
        AI
      </motion.span>
      LIGENT
    </div>
  );
};
