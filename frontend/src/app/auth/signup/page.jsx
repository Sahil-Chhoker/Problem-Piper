"use client";
import { useState } from "react";
import * as z from "zod"; // Changed import syntax
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Zod schema for form validation
const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*[0-9])/, 'Password must contain at least one number')
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    try {
      const result = signUpSchema.safeParse(formData); // Changed to safeParse
      if (!result.success) {
        const newErrors = {};
        result.error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        // Show toast for validation errors
        toast({
          title: "Validation Error",
          description: Object.values(newErrors)[0],
          variant: "destructive",
        });
        return false;
      }
      setErrors({});
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Validate field on change
    try {
      const fieldSchema = signUpSchema.shape[id];
      fieldSchema.parse(value);
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [id]: error.errors[0].message
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    localStorage.setItem("userName", formData.name);

    const apiRequestData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_ENDPOINT}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestData),
        }
      );

      if (response.ok) {
        const loginRequestData = {
          username: formData.email,
          password: formData.password,
        };
        const responseLogin = await fetch(
          `${process.env.NEXT_PUBLIC_GATEWAY_ENDPOINT}/user/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(loginRequestData).toString(),
          }
        );

        const loginData = await responseLogin.json();

        if (responseLogin.ok) {
          localStorage.setItem("access_token", loginData.access_token);
          window.dispatchEvent(new Event("authChange"));

          toast({
            title: "Registration Successful",
            description: "You have been logged in!",
            variant: "default",
          });

          router.push("/");
        } else {
          toast({
            title: "Auto-login Failed",
            description:
              "Registration successful but couldn't log you in automatically. Please try logging in manually.",
            variant: "destructive",
          });
          router.push("/auth/login");
        }
      } else {
        const data = await response.json();
        toast({
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Sign Up</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`text-white placeholder:text-gray-400 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            
            <Label htmlFor="email" className="text-white mt-4">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`text-white placeholder:text-gray-400 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
              className={`text-white placeholder:text-gray-400 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:text-white"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
          <p className="text-white mt-5 text-sm">
            Already Registered?&nbsp;
            <span
              className="text-sky-500 cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
      <Toaster />
    </div>
  );
}