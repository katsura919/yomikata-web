"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import MangaChapters from "@/components/manga/manga-chapters";
interface Manga {
  id: string;
  title: string;
  author: string;
  artist: string;
  description: string;
  altTitles: string[];
  contentRating: string;
  tags: string[];
  coverImage: string | null;
  publication: string;
}

export default function MangaDetails({ manga }: { manga: Manga }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="w-full flex justify-center">
      <div className="relative z-10 w-full max-w-[1200px] bg-white/10 backdrop-blur-md border border-white/20 text-foreground p-10 rounded-2xl shadow-lg space-y-8">
        {/* Manga Content */}
        <div className="flex flex-col md:flex-row gap-8 w-full items-center md:items-start">
          {/* Cover Image */}
          <div className="w-52 md:w-60 lg:w-72 flex-shrink-0">
            <img
              src={manga.coverImage || "/placeholder.jpg"}
              alt={manga.title}
              className="w-full h-auto object-cover rounded-xl shadow-xl"
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {manga.title}
            </h2>

            {manga.altTitles.length > 0 && (
              <p className="text-sm md:text-base text-gray-400">
                <span className="font-semibold">Also known as:</span>{" "}
                {manga.altTitles.join(", ")}
              </p>
            )}

            {/* Author & Artist */}
            <div className="text-sm md:text-base text-gray-300 space-y-2">
              <p>
                <span className="font-semibold">Author:</span>{" "}
                {manga.author || "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Artist:</span>{" "}
                {manga.artist || "Unknown"}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {manga.tags.map((tag) => (
                <Badge key={tag} className="text-xs px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Start Reading Button (Moved Here) */}
            <div className="flex justify-center md:justify-start">
            <MangaChapters mangaId={manga.id} />


            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm md:text-base text-gray-200 leading-relaxed text-justify">
          {manga.description ? (
            <p className={showFullDescription ? "" : "line-clamp-5"}>
              {manga.description}
            </p>
          ) : (
            <p className="italic text-gray-400">No description available.</p>
          )}

          {/* See More Button */}
          {manga.description && manga.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 flex items-center gap-1 text-primary hover:underline"
            >
              {showFullDescription ? "See Less" : "See More"}{" "}
              {showFullDescription ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
