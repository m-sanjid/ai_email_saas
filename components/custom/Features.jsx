"use client";
import React from "react";
import { motion } from "motion/react";
import {
  SparklesIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader } from "../ui/card";


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
];

function Features() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
          className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create amazing emails
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform makes email template creation simple, fast, and professional.
          </p>
        </motion.div>
        <Card className="mx-auto mt-8 max-w-4xl grid divide-y overflow-hidden shadow-lg md:mt-16 md:grid-cols-3 md:divide-x md:divide-y-0">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group p-6 text-center">
              <CardHeader className="pb-3 flex items-center justify-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-4 hover:bg-black/10 dark:hover:bg-white/5 backdrop-blur-sm transition-colors rounded-lg">
                  <feature.icon className="size-12" />
                </motion.div>
                <h3 className="mt-6 font-medium text-lg">{feature.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </motion.div>
          ))}
        </Card>
      </div>
    </section>
  );
}

export default Features;