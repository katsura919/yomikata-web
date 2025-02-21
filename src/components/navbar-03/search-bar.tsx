"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion"; // Import Framer Motion
import axios from "axios";

// Define types for Manga attributes and the response data
interface MangaAttributes {
  title: {
    en?: string;
    ja?: string;
  };
}

interface Manga {
  id: string;
  title: string;
  coverUrl: string;
}

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Manga[]>([]);

  console.log(results);

  // Update results dynamically as the search term changes
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setResults([]); // Clear results if search term is empty
        return;
      }

      try {
        const response = await axios.get(`/api/mangadex/search`, {
          params: { title: searchTerm }, // Pass search term to your Next.js API
        });

        setResults(response.data); // Update results
      } catch (error) {
        console.error("Error fetching manga data:", error);
      }
    };

    const debounceFetch = setTimeout(fetchResults, 300); // Debounce input

    return () => clearTimeout(debounceFetch); // Cleanup function
  }, [searchTerm]);

  return (
    <>
      {/* Search Icon Button (Mobile and Desktop) */}
      <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
        <Search className="h-5 w-5" />
        <span className="sr-only">Search manga</span>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-2xl border rounded-lg p-6 shadow-lg z-50">
          {/* Custom Header Without Default Close Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative mt-8"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
            <Input
              type="text"
              placeholder="Search manga..."
              className="w-full pl-10 border rounded-md focus:ring-0 focus:outline-none text-lg h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </motion.div>

          {/* Search Results */}
          {results && results.length > 0 ? (
            <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 max-h-96 overflow-y-auto space-y-3"
          >
            {results.map((manga) => (
              <li key={manga.id} className="flex items-center gap-4 p-2 border-b">
                <img
                  src={manga.coverUrl}
                  alt={manga.title}
                  className="w-16 h-24 object-cover rounded-md"
                />
                <a href={`/manga/${manga.id}`} className="hover:underline text-lg">
                  {manga.title}
                </a>
              </li>
            ))}
          </motion.ul>
          
          ) : (
            searchTerm.trim() !== "" && <p className="text-sm text-center mt-3">No results found</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
