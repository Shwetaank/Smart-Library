import React from "react";
import { ThumbsUp, MessageSquare, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} SmartLibrary. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-blue-500">
            <ThumbsUp className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-blue-500">
            <MessageSquare className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-blue-500">
            <Heart className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
