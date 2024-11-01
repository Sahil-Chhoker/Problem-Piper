"use client"
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function AuthNavbar() {
    const router= useRouter()
  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl fixed w-full z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer" onClick={() => router.push("/")}>
            Problem Piper
          </span>
        </div>
        <div className="flex gap-6">
          <Button variant="ghost" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:text-white"  onClick = {()=>router.push("/auth/login")}>
            Login
          </Button>
          <Button variant="ghost" className="text-black bg-white hover:opacity-90 hover:bg-gray-200 hover:text-black"  onClick = {()=>router.push("/auth/signup")}>
            Signup
          </Button>
          
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
