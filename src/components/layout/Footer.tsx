
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-tale-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-tale-accent rounded-full blur-sm animate-pulse-glow"></div>
                <Sparkles className="h-6 w-6 text-tale-accent relative" />
              </div>
              <span className="text-xl font-display font-bold text-white">TaleCloud</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Create beautiful, AI-generated stories with illustrations and audio narration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-tale-accent transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-tale-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/create" className="text-gray-300 hover:text-tale-accent transition-colors">Story Creation</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">AI Illustrations</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">Voice Narration</Link></li>
              <li><Link to="/library" className="text-gray-300 hover:text-tale-accent transition-colors">Story Library</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-tale-accent transition-colors">About</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">API</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">Documentation</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-tale-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TaleCloud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
