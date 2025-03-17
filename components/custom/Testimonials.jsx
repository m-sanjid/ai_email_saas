"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

const testimonials = [
  {
    content: "This AI email builder has completely transformed how we handle our email marketing. It's incredibly intuitive and saves us hours of work.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    image: "/avatars/avatar1.png"
  },
  {
    content: "The templates are beautiful and the AI suggestions are spot-on. It's like having a professional email designer on your team.",
    author: "Michael Chen",
    role: "Founder",
    company: "StartupX",
    image: "/avatars/avatar2.png"
  },
  {
    content: "We've seen a 40% increase in email engagement since switching to this platform. The results speak for themselves.",
    author: "Emma Davis",
    role: "Email Marketing Lead",
    company: "GrowthCo",
    image: "/avatars/avatar3.png"
  }
];

function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by marketers worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.author}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;