"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const faqs = [
  {
    question: "How does the AI email template generator work?",
    answer: "Our AI analyzes your requirements and generates professional email templates using advanced machine learning algorithms. Simply input your needs, and the AI will create a customized template that you can further refine."
  },
  {
    question: "Can I customize the generated templates?",
    answer: "Yes, absolutely! All templates are fully customizable. You can modify colors, fonts, layouts, and content to match your brand identity and specific needs."
  },
  {
    question: "Are the templates mobile-responsive?",
    answer: "Yes, all our templates are fully responsive and tested across various email clients and devices to ensure they look great everywhere."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a free plan that lets you generate up to 5 templates per month. This allows you to try our platform and see the value before committing to a paid plan."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer email support for all users and priority support for Pro and Enterprise plans. Enterprise customers also get a dedicated account manager."
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="mt-20 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;