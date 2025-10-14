"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Shield,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  Users,
  CheckCircle,
  Zap,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const features = [
    {
      icon: BarChart3,
      title: "Risk Assessment Dashboard",
      description:
        "Visual analytics of your farm's biosecurity risk levels with interactive charts and trends",
      href: "/Dashboard",
    },
    {
      icon: ClipboardList,
      title: "Smart Risk Quiz",
      description:
        "Quick assessment tool to evaluate your farm's current biosecurity measures",
      href: "/RiskAssesment",
    },
    {
      icon: Shield,
      title: "Activity Logging",
      description:
        "Track cleaning, vaccination, and feeding activities with digital compliance records",
      href: "/FarmRecords",
    },
    {
      icon: AlertTriangle,
      title: "Disease Alerts",
      description:
        "Real-time notifications about disease outbreaks and biosecurity threats in your region",
      href: "/AlertCenter",
    },
  ];

  const benefits = [
    "Reduce disease outbreak risks by 60%",
    "Digital compliance tracking",
    "Regional alert notifications",
    "Easy-to-use mobile interface",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <Shield className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">FarmShield</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex items-center space-x-4"
          >
            <Button
              asChild
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white text-green-700 hover:bg-gray-100"
            >
              <Link href="/signup">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:hidden text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4"
          >
            <div className="flex flex-col space-y-3">
              <Button
                asChild
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="bg-white text-green-700 hover:bg-gray-100"
              >
                <Link href="/signup">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center text-white"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <Shield className="h-12 w-12" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            <span className="inline-block">Farm</span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200">
              Shield
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Comprehensive biosecurity management for pig and poultry farms. Protect your
            livestock with intelligent risk assessment and compliance tracking.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-green-700 hover:bg-gray-100"
            >
              <Link href="/Dashboard">
                View Dashboard
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/RiskAssesment">
                Take Risk Assessment
              </Link>
            </Button>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all duration-300"
              >
                <CheckCircle className="h-6 w-6 mb-2 mx-auto text-green-300" />
                <p className="text-sm font-medium">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Comprehensive Farm Management</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to maintain biosecurity standards and protect your farm investment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link href={feature.href}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                      <CardHeader className="text-center pb-4">
                        <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                          <FeatureIcon className="h-10 w-10 text-green-600 mx-auto" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: "5,000+", label: "Farms Protected", color: "text-green-600" },
              { icon: Shield, value: "99.2%", label: "Risk Reduction", color: "text-green-600" },
              { icon: BarChart3, value: "24/7", label: "Monitoring", color: "text-green-600" },
            ].map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <StatIcon className={`h-8 w-8 ${stat.color} mx-auto mb-4`} />
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-green-600">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Protect Your Farm?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of farmers who trust FarmShield to keep their livestock safe and
              their farms compliant.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-green-600 hover:bg-gray-100"
            >
              <Link href="/signup">
                Get Started Today
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
