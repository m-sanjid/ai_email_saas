"use client";
import React from "react";
import { motion } from "motion/react";
import { User2Icon } from "lucide-react";

const testimonials = [
  {
    content: "This AI email builder has completely transformed how we handle our email marketing. It's incredibly intuitive and saves us hours of work.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    image: <User2Icon className="p-2 rounded-full bg-muted-foreground dark:bg-muted text-black dark:text-white size-10" />
  },
  {
    content: "The templates are beautiful and the AI suggestions are spot-on. It's like having a professional email designer on your team.",
    author: "Michael Chen",
    role: "Founder",
    company: "StartupX",
    image: <User2Icon className="p-2 rounded-full bg-muted-foreground dark:bg-muted text-black dark:text-white size-10" />
  },
  {
    content: "We've seen a 40% increase in email engagement since switching to this platform. The results speak for themselves.",
    author: "Emma Davis",
    role: "Marketing Lead",
    company: "GrowthCo",
    image: <User2Icon className="p-2 rounded-full bg-muted-foreground dark:bg-muted text-black dark:text-white size-10" />
  }
];

function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
          className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by marketers worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See what our customers have to say about their experience
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 pb-24 rounded-lg  bg-muted dark:bg-zinc-900"
            >
              <div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </div>
              <div className="absolute bottom-2 translate-x-1/6">
                <div className="flex items-center gap-6 mt-4">
                  <div>{testimonial.image}</div>
                  <div>
                    <h3 className="font-semibold">{testimonial.author}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;