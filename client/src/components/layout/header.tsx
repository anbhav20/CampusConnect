import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isLandingPage = location === "/";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-4H7V8h4v8zm6 0h-2v-4h-2V8h4v8z" />
            </svg>
            <Link href="/">
              <span className="text-xl font-bold text-gray-900 cursor-pointer">Campus Connect</span>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          {isLandingPage && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary font-medium">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-primary font-medium">Contact</a>
            </div>
          )}
          
          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-primary font-medium">Login</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-primary text-white hover:bg-primary/90">Sign Up</Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden mt-4 pb-3 border-t border-gray-200 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="mt-3 space-y-1">
            {isLandingPage && (
              <>
                <a 
                  href="#features" 
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <a 
                  href="#testimonials" 
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a 
                  href="#contact" 
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </>
            )}
            
            <div className="pt-4 flex flex-col space-y-3 border-t border-gray-200 mt-3">
              <Link href="/auth">
                <span className="block px-4 py-2 text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </span>
              </Link>
              <Link href="/auth">
                <span 
                  className="mx-4 px-4 py-2 bg-primary text-white rounded-md font-medium text-center block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
