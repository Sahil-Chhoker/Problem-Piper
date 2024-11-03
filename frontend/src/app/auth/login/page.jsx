"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send login request
      const response = await fetch(
       `${process.env.NEXT_PUBLIC_GATEWAY_ENDPOINT}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        }
      );

      // Parse the response
      const data = await response.json();

      // Check if login was successful
      if (response.ok) {
        // Store the access token in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("userEmail", formData.username);

        // Show success toast
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default",
        });

        // Redirect to a protected route
        router.push("/");
      } else {
        // Handle login errors
        toast({
          title: "Login Failed",
          description: data.message || "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle network or other errors
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="text-white placeholder:text-gray-400"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-white placeholder:text-gray-400"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:text-white"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-white mt-5 text-sm">
            Not Registered?&nbsp; 
            <span
              className="text-sky-500 cursor-pointer"
              onClick={() => router.push("/auth/signup")}
            >
              SignUp
            </span>
          </p>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
