import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Check, Crown, Zap, Shield, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  buttonText: string;
  buttonLink: string;
}

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: billingPeriod === "monthly" ? "$0" : "$0",
      description: "Perfect for beginners exploring 3D creation",
      features: [
        "Basic 3D model library",
        "Up to 3 saved projects",
        "Standard rendering quality",
        "Community support",
        "720p exports",
      ],
      icon: <Users className="w-5 h-5" />,
      color: "from-gray-600 to-gray-700",
      buttonText: "Get Started",
      buttonLink: "/signup",
    },
    {
      name: "Pro",
      price: billingPeriod === "monthly" ? "$19" : "$190",
      description: "For creators who need more power and flexibility",
      features: [
        "Everything in Free",
        "Unlimited projects",
        "Premium model library",
        "High-quality rendering",
        "Priority support",
        "1080p exports",
        "Custom textures",
      ],
      icon: <Zap className="w-5 h-5" />,
      color: "from-blue-600 to-violet-600",
      popular: true,
      buttonText: "Upgrade to Pro",
      buttonLink: "/signup?plan=pro",
    },
    {
      name: "Enterprise",
      price: billingPeriod === "monthly" ? "$49" : "$490",
      description: "For teams and professional creators",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom branding",
        "Dedicated support",
        "4K exports",
        "Advanced physics",
        "White-label option",
      ],
      icon: <Crown className="w-5 h-5" />,
      color: "from-amber-500 to-orange-600",
      buttonText: "Contact Sales",
      buttonLink: "/contact",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - VXLVerse</title>
        <meta name="description" content="Choose the perfect plan for your 3D creation needs" />
      </Helmet>

      <div className="min-h-screen bg-gray-950 text-white">
        <Header />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400"
              >
                Choose Your Perfect Plan
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-gray-300 mb-8"
              >
                Unlock the full potential of your 3D creations with our flexible pricing options. No
                hidden fees, cancel anytime.
              </motion.p>

              {/* Billing Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center p-1 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50 mb-8"
              >
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingPeriod === "monthly"
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingPeriod === "yearly"
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  className={`relative rounded-2xl overflow-hidden border ${
                    tier.popular ? "border-blue-500/50" : "border-gray-800/50"
                  } bg-gray-900/50 backdrop-blur-sm shadow-xl ${
                    tier.popular ? "shadow-blue-500/10" : ""
                  } flex flex-col h-full`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-4 py-1 transform rotate-0 origin-top-right">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-8 flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.color} text-white`}>
                        {tier.icon}
                      </div>
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold">{tier.price}</span>
                        {tier.price !== "$0" && (
                          <span className="text-gray-400 mb-1">
                            /{billingPeriod === "monthly" ? "mo" : "yr"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{tier.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <div className="mt-1 p-0.5 rounded-full bg-green-500/20 text-green-400">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-8 pb-8">
                    <Link
                      to={tier.buttonLink}
                      className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-all duration-300 ${
                        tier.popular
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20"
                          : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      }`}
                    >
                      {tier.buttonText}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto mt-24">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-center mb-12"
              >
                Frequently Asked Questions
              </motion.h2>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold mb-2">Can I change my plan later?</h3>
                  <p className="text-gray-300">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will take
                    effect at the start of your next billing cycle.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                  <p className="text-gray-300">
                    We offer a 14-day free trial for our Pro plan. No credit card required to start
                    your trial.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-300">
                    We accept all major credit cards, PayPal, and Apple Pay. For Enterprise plans,
                    we also offer invoice-based payments.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
                  <p className="text-gray-300">
                    Yes, you can cancel your subscription at any time from your account settings.
                    You'll continue to have access until the end of your current billing period.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="max-w-4xl mx-auto mt-24 p-8 rounded-2xl bg-gradient-to-r from-blue-900/30 to-violet-900/30 border border-blue-500/20 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Our team is here to help you find the perfect plan for your needs. Contact us for
                personalized assistance.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
