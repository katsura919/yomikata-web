"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Search Icon Button (Mobile) */}
      <Button
        variant="ghost"
        size="icon"
        className="block md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-5 h-5 text-white" />
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white border rounded-lg p-4 shadow-lg z-50">
          {/* Custom Header Without Default Close Button */}
          <div className="relative mt-7">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-10 border rounded-md focus:ring-0 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Recent Searches Text */}
          <p className="text-gray-400 text-sm text-center mt-3">No recent searches</p>
        </DialogContent>
      </Dialog>

      {/* Always Visible Search Bar on Desktop */}
      <div className="hidden md:block max-w-[800px]">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full rounded-md border px-4 py-3 text-base shadow-sm focus:outline-none"
        />
      </div>
    </>
  );
};

export default SearchBar;
