
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen } from 'lucide-react';
import ApiKeySettings from '@/components/settings/ApiKeySettings';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm py-4 fixed w-full z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-tale-primary rounded-full blur-sm animate-pulse-glow"></div>
            <Sparkles className="h-6 w-6 text-tale-primary relative" />
          </div>
          <span className="text-xl font-display font-bold text-tale-primary">TaleCloud</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-tale-primary transition-colors">
            Home
          </Link>
          <Link to="/create" className="text-gray-700 hover:text-tale-primary transition-colors">
            Create
          </Link>
          <Link to="/library" className="text-gray-700 hover:text-tale-primary transition-colors">
            Library
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-tale-primary transition-colors">
            About
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <ApiKeySettings />
          
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link to="/login">
              Login
            </Link>
          </Button>
          <Button asChild className="bg-tale-primary hover:bg-tale-secondary">
            <Link to="/create">
              <BookOpen className="h-4 w-4 mr-2" /> Create Story
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
