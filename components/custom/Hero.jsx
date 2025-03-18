"use client";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { LogoText } from "./Logo";

function Hero() {
  return (
    <section className="relative px-6 py-24 md:py-32 md:px-10 lg:px-20 xl:px-32 overflow-hidden">
      <div className="relative max-w-4xl mx-auto">
        <div className="grid gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            className="text-center"
          >
            <Link href="/" className="rounded-md mx-auto flex w-fit items-center gap-2 border p-1 pr-3">
              <span className="bg-muted rounded-md px-2 py-1 text-xs">New</span>
              <span className="text-sm">Your Email Marketing Made Easy</span>
              <span className="bg-muted block h-4 w-px"></span>
              <ArrowRight className="size-4" />
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125] text-center"
            >
              Create Beautiful Email Templates<br/>
              <div className="inline-block"><LogoText /></div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
              className="mt-6 max-w-2xl mx-auto  md:text-lg text-muted-foreground leading-relaxed"
            >
              Transform your email marketing with AI-powered templates. Design stunning, responsive emails in minutes, not hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              className="mt-8"
            >
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-black dark:bg-neutral-200 dark:hover:bg-white shadow-lg hover:shadow-xl transition-all">
                <Link href="#">
                  <Rocket className="relative size-4" />
                  <span className="text-nowrap">Start Building</span>
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
              className="mt-8 flex items-center gap-4 justify-center text-sm text-muted-foreground max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
                className="flex -space-x-2"
              >
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full border-2 dark:border-white border-zinc-300 bg-gray-400 dark:bg-zinc-700"
                  />
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
              >
                Join 10,000+ marketers already using our platform
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:h-[600px] mt-10"
          >
            <div className="relative w-full h-full">
              <div className="bg-white dark:bg-black p-4 w-fit rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-700">
                <Image
                  src="/dashboard-preview.png"
                  alt="Email Template Builder Interface"
                  width={800}
                  height={600}
                  className="rounded-xl shadow-2xl"
                  priority
                />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white dark:bg-zinc-900 border p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-primary dark:text-white" />
                  </div>
                  <div>
                    <p className="font-medium">AI Generated</p>
                    <p className="text-sm text-gray-500">In seconds</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
