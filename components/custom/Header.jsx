"use client";
import React, { useEffect, useState } from "react";
import SignInButton from "./SignInButton";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "./Logo";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react"; 

function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(true);
  const { data: session } = useSession(); // Get session data
  
  // Extract user details from session
  const userDetail = session?.user;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = () => {
    if (!userDetail?.email) return "US";
    const email = userDetail.email;
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`sticky ${isScrolled ? "top-3 border rounded-lg max-w-6xl mx-auto" : "top-0"} px-10 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 duration-300 easeInOut`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/home">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" size="sm">
                Features
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                Pricing
              </Button>
            </Link>
            <Link href="/ai-assistant">
              <Button variant="ghost" size="sm">
                AI Assistant
              </Button>
            </Link>
            {userDetail?.email && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {mounted && resolvedTheme === "dark" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Section */}
          {userDetail?.email ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      src={userDetail?.picture || ""}
                      alt={userDetail?.email}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span className="text-xs opacity-70">
                      {userDetail.email}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:block">
              <SignInButton />
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4 px-4 border-t">
          <div className="flex flex-col space-y-3 pt-3">
            <Link href="/features" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Features</Button>
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Pricing</Button>
            </Link>
            {userDetail?.email ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
                <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Account</Button>
                </Link>
                <Link href="/logout" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-destructive">Logout</Button>
                </Link>
              </>
            ) : (
              <div className="pt-2">
                <SignInButton />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;