"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import MovingBackground from "@/components/navbar/moving-bg"; // Import the new component

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="relative w-full h-[80px] md:h-[100px] lg:h-[90px] shadow-none backdrop-blur-lg overflow-hidden ">
      {/* Background Animation */}
      <MovingBackground />

      <div className="relative container mx-auto flex items-center justify-between p-4">
        {/* Left: App Title */}
        <Link href="/" className="text-2xl font-bold text-white relative z-10">
          Yomikata
        </Link>

        {/* Center: Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex w-1/3 relative z-10">
          <Input
            type="text"
            placeholder="Search manga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-gray-300 border border-white/20"
          />
        </div>

        {/* Right: Navigation Links & Mode Toggle */}
        <div className="hidden md:flex items-center gap-4 relative z-10">
          <Link href="/browse" className="text-lg font-medium text-white">
            Browse
          </Link>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden relative z-10">
              <Menu size={24} className="text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6 bg-black/90">
            <MobileMenu />
          </SheetContent>
        </Sheet>
      </div>
    </nav>

  );
}

function MobileMenu() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/" className="text-xl font-bold text-white">
        Yomikata
      </Link>
      <Input type="text" placeholder="Search manga..." className="w-full bg-white/10 text-white placeholder-gray-300 border border-white/20" />
      <Link href="/browse" className="text-lg font-medium text-white">
        Browse
      </Link>
      <ModeToggle />
    </div>
  );
}
