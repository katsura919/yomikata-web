"use client";

import { useEffect, useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Link from "next/link";
import Image from "next/image";

interface Manga {
  id: string;
  title: string;
  coverUrl: string;
  authors: string;
}

export default function MangaCarousel() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedManga() {
      try {
        const response = await fetch("/api/mangadex/mangaCarousel"); // Calls your Next.js API
        const data = await response.json();

        const formattedManga = data.data.map((manga: any) => ({
          id: manga.id,
          title: manga.attributes.title.en || "Unknown Title",
          coverUrl: manga.relationships.find((rel: any) => rel.type === "cover_art")
            ? `https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find((rel: any) => rel.type === "cover_art").attributes.fileName}.512.jpg`
            : "/placeholder.jpg",
          authors: manga.relationships
            .filter((rel: any) => rel.type === "author")
            .map((author: any) => author.attributes.name)
            .join(", ") || "Unknown Author",
        }));

        setMangaList(formattedManga);
      } catch (error) {
        console.error("Error fetching manga:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedManga();
  }, []);

  return (
    <div className="w-[95%] max-w-[1900px] mx-auto relative">
      <Carousel 
        className="w-full overflow-hidden" 
        opts={{ align: "start", loop: false }}
      >
        <CarouselContent className="flex">
          {loading
            ? // Show skeletons while loading
              Array.from({ length: 20 }).map((_, index) => (
                <CarouselItem 
                  key={index} 
                  className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-[12.5%]"
                >
                  <Skeleton className="w-full h-[210px] sm:h-[270px] md:h-[270px] lg:h-[350px] rounded-md" />
                </CarouselItem>
              ))
            : // Show real manga after loading
              mangaList.map((manga) => (
                <CarouselItem 
                  key={manga.id} 
                  className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-[12.5%]"
                >
                  <Link 
                    href={`/manga/${manga.id}`} 
                    className="group relative block w-full h-[210px] sm:h-[290px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-md"
                  >
                    <Image 
                      src={manga.coverUrl}
                      alt={manga.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4 text-white transition-transform duration-500 group-hover:translate-y-[-10px]">
                      <h3 className="text-lg font-bold truncate">{manga.title}</h3>
                      <p className="text-sm opacity-75 truncate">{manga.authors}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))
          }
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition z-10" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition z-10" />
      </Carousel>
    </div>
  );
}
