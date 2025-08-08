
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card/50 py-6 mt-auto border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">&copy; {currentYear ?? ''} Bakebook. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">A creation by Waves Digital Services</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/contact" 
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Contact Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/legal/terms" 
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/legal/privacy" 
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Crafted with <span className="text-primary">&hearts;</span> for Bakers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
