"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MangaDetails from "@/components/manga/manga-details";

interface Manga {
  id: string;
  title: string;
  altTitles: string[];
  author: string;
  artist: string;
  description: string;
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
  const [error, setError] = useState<string | null>(null);
  console.log(manga)
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetch(`/api/mangadex/mangaDetails/${id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setError(data.error || 'Manga not found');
          setManga(null);
        } else {
          setManga(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching manga:", err);
          setError('An error occurred while fetching manga details.');
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!manga) return <div className="text-center text-red-500">Manga not found</div>;

  return (
    <div
      className="w-full h-screen overflow-y-auto scrollbar-custom flex justify-center items-start"
      style={{
        backgroundImage: `url(${manga.coverImage || 'fallback-image-url'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-lg"></div>
      <div className="relative z-10 w-[90%] max-w-[1400px] mx-1 lg:ml-5 mt-20 py-12 grid place-items-center">
        <div className="grid grid-cols-1 gap-8 w-full">
          <MangaDetails manga={manga} />
        </div>
      </div>
    </div>
  );
}
