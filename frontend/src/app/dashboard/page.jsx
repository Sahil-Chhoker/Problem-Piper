"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Code, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Dashboard = () => {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [user, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const subscriptionStatus = localStorage.getItem("subsciption_status");
    const username = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (subscriptionStatus === "Subscribed") {
      setIsSubscribed(true);
    }
    if (username) {
      setUsername(username);
    }
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  async function sendWelcomeEmail() {
    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: user,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send welcome email");
      }
    } catch (error) {
      console.error("Error sending welcome email:", error);
      toast({
        title: "Email Error",
        description: "Failed to send welcome email. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function subscribe() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_ENDPOINT}/subscribe`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.setItem("subsciption_status", "Subscribed");
        setIsSubscribed(true);

        // Send welcome email after successful subscription
        await sendWelcomeEmail();

        toast({
          title: "Successfully Subscribed",
          description:
            "Thanks for subscribing!",
          variant: "default",
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: `Error: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Subscription error:", error);
    }
  }
  async function unsubscribe() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_ENDPOINT}/unsubscribe`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("subsciption_status");
        setIsSubscribed(false);

        toast({
          title: "Successfully Unsubscribed",
          description: "We're sorry to see you go!",
          variant: "default",
        });
      } else {
        toast({
          title: "Unsubscribe Failed",
          description: `Error: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Unsubscribe error:", error);
    }
  }

  const handleSubscriptionToggle = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="relative pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500">
                Welcome {user}
              </h1>

              <p className="text-xl text-white/70 mb-10 leading-relaxed">
                {isSubscribed
                  ? "You're subscribed! Get ready for daily coding challenges to enhance your skills."
                  : "Stay committed to your coding journey by receiving daily coding challenges designed to enhance your problem-solving skills and push you towards coding mastery."}
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  className={`px-5 text-lg h-12 ${
                    isSubscribed
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  } hover:opacity-90`}
                  onClick={handleSubscriptionToggle}
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {!isSubscribed && (
            <div className="container mx-auto px-6 mt-24 justify-center flex flex-col items-center gap-y-6">
              <p className="text-5xl font-bold mt-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 leading-relaxed">
                Why Subscribe?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Code className="w-6 h-6 text-purple-400" />,
                    title: "Daily Practice",
                    description:
                      "Receive a new problem each day, crafted to challenge and improve your skills progressively",
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-pink-400" />,
                    title: "Curated Content",
                    description:
                      " Our challenges are sourced from platforms like HackerRank, tailored for all experience levels",
                  },
                  {
                    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
                    title: "Stay Motivated",
                    description:
                      "Make coding a habit with our daily challenges and watch your skills grow",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="p-3 bg-white/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/60">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-4xl mx-auto text-center mt-20">
            <p className="text-xl text-white/70 leading-relaxed">
              <span
                className="text-white cursor-pointer"
                onClick={handleSubscriptionToggle}
              >
                {isSubscribed ? "" : "Subscribe Now!!"}
              </span>
              {isSubscribed
                ? " Thank you for being a subscriber! You'll receive your first challenge soon."
                : " and Start Coding Every Day! Ready to make a difference in your coding skills? Subscribe to our daily problem service, and we'll make sure a new coding problem arrives in your inbox each day."}
            </p>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Dashboard;
