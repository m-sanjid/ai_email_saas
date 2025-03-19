"use client"
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { LogoImage } from "./Logo";

function Footer() {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
        <motion.div initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-auto max-w-4xl">
          <div className="col-span-1 md:col-span-2">
            <LogoImage />
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="#testimonials">Testimonials</Link></li>
              <li><Link href="#faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </motion.div>
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Emailigent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
