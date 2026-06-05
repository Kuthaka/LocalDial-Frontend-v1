"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Nearby Direct?",
    answer: "Nearby Direct is a premium local search platform designed to help you discover the best restaurants, services, and professionals right in your neighborhood.",
  },
  {
    question: "How do I list my business?",
    answer: "You can list your business for free by clicking the 'Add Business' button in the top navigation bar. Fill out your details, verify your identity, and your profile will be live in minutes.",
  },
  {
    question: "Is it completely free to use?",
    answer: "Absolutely! Searching for places, reading reviews, and getting contact information is 100% free for all users.",
  },
  {
    question: "How do you verify reviews?",
    answer: "We use a multi-step verification process to ensure authenticity. Only users who have legitimately interacted with a business can leave verified reviews.",
  },
  {
    question: "Can I update my location manually?",
    answer: "Yes, you can click on the location pin in the top bar to manually set your city or neighborhood if you are looking for businesses in a different area.",
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-[#1c2331] tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-slate-300"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-bold text-[#1c2331] text-lg pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
