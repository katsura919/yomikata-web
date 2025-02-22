import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ModeToggle } from "../theme-toggle";
import SearchBar from "@/components/navbar-03/search-bar";
import Link from "next/link";
const Navbar03Page = () => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-[1400px] w-[95%] z-50 ">
      <nav className="h-16 bg-white/10 backdrop-blur-xl shadow-lg border border-white/20 rounded-xl">
        <div className="h-full flex items-center justify-between px-4 w-full">
          {/* Left: Logo & Desktop Menu */}
          <div className="flex items-center gap-10 flex-grow">
          <Link href="/"><Logo /></Link>
            <NavMenu className="hidden md:block" />
          </div>

          {/* Right: Search Bar, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <ModeToggle />

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar03Page;
