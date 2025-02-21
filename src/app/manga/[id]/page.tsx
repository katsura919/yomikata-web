"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MangaDetails from "@/components/manga/manga-details";
import MangaChapters from "@/components/manga/manga-chapters";

interface Manga {
    id: string;
    title: string;
    altTitles: string[]; // Add alternative titles
    author: string;
    artist: string;
    description: string; // Add description
    contentRating: string;
    tags: string[];
    coverImage: string | null;
    publication: string;
  }
  

export default function MangaPage() {
    const params = useParams();
    const id = typeof params?.id === "string" ? params.id : "";
    
    const [manga, setManga] = useState<Manga | null>(null);
    const [loading, setLoading] = useState(true);
    console.log(manga)
    useEffect(() => {
      if (!id) return;
  
      const controller = new AbortController();
  
      fetch(`/api/mangadex/mangaDetails/${id}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.error) {
            setManga(null);
          } else {
            setManga(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Error fetching manga:", err);
          }
          setLoading(false);
        });
  
      return () => controller.abort();
    }, [id]);
  
    if (loading) return <div className="text-center text-white">Loading...</div>;
    if (!manga) return <div className="text-center text-red-500">Manga not found</div>;
  
    return (
        <div
        className="w-full h-screen overflow-y-auto scrollbar-custom flex justify-center items-start"
        style={{
          backgroundImage: `url(${manga.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Blur & Dark Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg"></div>
      
        {/* Scrollable Content (Grid Layout for Centering) */}
        <div className="relative z-10 w-[90%] max-w-[1400px] mx-1 lg:ml-5 mt-20 py-12 grid place-items-center">
          <div className="grid grid-cols-1 gap-8 w-full">
            {/* Manga Details */}
            <MangaDetails manga={manga} />
      
          </div>
        </div>
      </div>
      
      
      );
      
      
      
  }
  