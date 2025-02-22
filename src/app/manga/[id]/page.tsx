"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MangaDetails from "@/components/manga/manga-details";
import { Skeleton } from "@/components/ui/skeleton";

interface Manga {
  id: string;
  title: string;
  altTitles: string[];
  author: string;
  artist: string;
  description: string;
  contentRating: string;
  tags: string[];
  coverImage: string;
  publication: string;
}

export default function MangaPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(manga);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetch(`https://yomikata-server.onrender.com/manga/${id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setError(data.error || "Manga not found");
          setManga(null);
        } else {
          setManga(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching manga:", err);
          setError("An error occurred while fetching manga details.");
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const coverImageUrl = manga?.coverImage
    ? `https://yomikata-server.onrender.com${manga.coverImage}`
    : "fallback-image-url";

  return (
    <div
      className="w-full h-screen overflow-y-auto scrollbar-custom flex justify-center items-start"
      style={{
        backgroundImage: `url(${coverImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-lg"></div>
      <div className="relative z-10 w-[90%] max-w-[1400px] mx-1 lg:ml-5 mt-20 py-12 grid place-items-center">
        <div className="grid grid-cols-1 gap-8 w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <Skeleton className="w-60 h-80 rounded-md" />
              <Skeleton className="w-48 h-6 rounded-md" />
              <Skeleton className="w-40 h-4 rounded-md" />
              <Skeleton className="w-full h-20 rounded-md" />
              <Skeleton className="w-40 h-4 rounded-md" />
            </div>
          ) : manga ? (
            <MangaDetails manga={manga} />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
