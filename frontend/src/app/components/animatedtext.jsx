import { useState,useEffect } from "react";
import {  Sparkles } from "lucide-react";
const AnimatedText = () => {
    const texts = [
      "Get daily coding problems",
      "Master DSA challenges",
      "Improve problem-solving",
      "Track your progress",
      "Practice consistently"
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      const textInterval = setInterval(() => {
        setIsVisible(false);
        
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setIsVisible(true);
        }, 500); 
        
      }, 3000); 
  
      return () => clearInterval(textInterval);
    }, []);
  
    return (
      <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 ">
        <Sparkles className="w-4 h-4 text-purple-400 " />
        <span 
          className={`text-sm text-white/70 transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {texts[currentIndex]}
        </span>
      </div>
    );
  };

  export default AnimatedText;