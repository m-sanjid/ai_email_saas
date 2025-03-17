"use client";
import React from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { CheckIcon } from "@heroicons/react/24/solid";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our platform",
    features: [
      "5 AI-generated templates/month",
      "Basic customization",
      "Email support",
      "Community access"
    ]
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Best for growing businesses",
    features: [
      "Unlimited AI-generated templates",
      "Advanced customization",
      "Priority support",
      "Team collaboration",
      "Custom branding",
      "Analytics dashboard"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom AI training"
    ]
  }
];

function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? "bg-gradient-to-b from-primary to-purple-600 text-white"
                  : "bg-white border border-gray-200"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0">
                  <div className="mx-auto w-fit px-4 py-1 rounded-full bg-white text-primary text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-xl text-gray-200">{plan.period}</span>
                  )}
                </div>
                <p className={`mt-2 ${plan.popular ? "text-gray-200" : "text-gray-600"}`}>
                  {plan.description}
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon className={`h-5 w-5 ${plan.popular ? "text-white" : "text-primary"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  plan.popular
                    ? "bg-white text-primary hover:bg-gray-100"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Get started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;