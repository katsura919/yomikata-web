import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/20 bg-white/10 backdrop-blur-xl shadow-lg py-12 mt-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Logo & About Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold tracking-widest">YOMIKATA</h2>
            <p className="text-base opacity-80 mt-2">Your ultimate manga reading experience.</p>
          </div>

          {/* Footer Links - 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center md:text-left">
            {/* Overview Section */}
            <div>
              <h3 className="text-lg font-semibold opacity-80 mb-2">OVERVIEW</h3>
              <ul className="space-y-2 text-base">
                <li><Link href="/about" className="hover:underline">About</Link></li>
                <li><Link href="/features" className="hover:underline">Features</Link></li>
                <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Docs Section */}
            <div>
              <h3 className="text-lg font-semibold opacity-80 mb-2">DOCS</h3>
              <ul className="space-y-2 text-base">
                <li><Link href="/docs/getting-started" className="hover:underline">Getting Started</Link></li>
                <li><Link href="/docs/tutorials" className="hover:underline">Tutorials</Link></li>
                <li><Link href="/docs/api" className="hover:underline">API Reference</Link></li>
                <li><Link href="/docs/faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            {/* Community Section */}
            <div>
              <h3 className="text-lg font-semibold opacity-80 mb-2">COMMUNITY</h3>
              <ul className="space-y-2 text-base">
                <li><a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub ↗</a></li>
                <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">X (Twitter) ↗</a></li>
                <li><a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord ↗</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 text-base opacity-80">
          {/* Social Media Icons */}
          <div className="flex gap-6">
            <a href="#" aria-label="Facebook"><Facebook className="w-6 h-6" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="w-6 h-6" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="w-6 h-6" /></a>
            <a href="#" aria-label="GitHub"><Github className="w-6 h-6" /></a>
            <a href="#" aria-label="Discord"><MessageCircle className="w-6 h-6" /></a>
          </div>

          {/* Copyright */}
          <div className="mt-4 md:mt-0 text-center md:text-right">
            &copy; {new Date().getFullYear()} Yomikata. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
