"use client";
import React from "react";
import { motion } from "motion/react";
import { 
  SparklesIcon, 
  ClockIcon, 
  DevicePhoneMobileIcon,
  PaintBrushIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Creation",
    description: "Generate professional email templates instantly using advanced AI technology."
  },
  {
    icon: ClockIcon,
    title: "Save Time",
    description: "Create beautiful emails in minutes instead of hours with our intuitive builder."
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Responsive Design",
    description: "All templates are fully responsive and look great on any device."
  },
  {
    icon: PaintBrushIcon,
    title: "Customizable",
    description: "Easily customize colors, fonts, and layouts to match your brand."
  }
];

function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create amazing emails
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform makes email template creation simple, fast, and professional.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-50 blur" />
              <div className="relative flex flex-col items-center p-6 bg-white rounded-lg">
                <feature.icon className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-center text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;