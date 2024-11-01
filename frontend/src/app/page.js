"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Code, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedText from "./components/animatedtext";

const Homepage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("access_token");
      setIsLoggedIn(!!accessToken);
    };
    checkAuthStatus();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="relative pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedText />

              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500">
                Master Coding
                <br />
                One Problem at a Time
              </h1>

              <p className="text-xl text-white/70 mb-10 leading-relaxed">
                Get curated HackerRank problems delivered daily to sharpen your
                coding skills. Turn consistent practice into coding excellence
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 px-8 h-12"
                  onClick={() => router.push(isLoggedIn ? "/dashboard" : "/auth/login")}
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code className="w-6 h-6 text-purple-400" />,
                  title: "Daily Problems",
                  description:
                    "Fresh coding challenges from HackerRank delivered to you every day, carefully selected for steady progression",
                },
                {
                  icon: <Zap className="w-6 h-6 text-pink-400" />,
                  title: "Smart Curation",
                  description:
                    "Problems tailored to your skill level, from basic algorithms to advanced data structures",
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-purple-400" />,
                  title: "Track Progress",
                  description:
                    "Monitor your growth with detailed solving statistics and improvement metrics",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="p-3 bg-white/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;