"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useRouter } from "next/navigation"; // Import useRouter

interface Chapter {
  id: string;
  title: string;
  chapterNumber: string;
  uploadDate: string;
}

export default function MangaChapters({ mangaId }: { mangaId: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (!mangaId) return;

    const controller = new AbortController();

    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`/api/mangadex/mangaChapters/${mangaId}`, {
          signal: controller.signal,
        });

        setChapters(data);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        console.error("Error fetching chapters:", err);
        setError(err.message || "Failed to fetch chapters");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();

    return () => controller.abort();
  }, [mangaId]);

  const handleReadClick = (chapterId: string) => {
    router.push(`/reading/${chapterId}`); // Navigate to the reading page with the chapter ID
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="w-full md:w-auto text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 rounded-2xl shadow-xl transform transition-all hover:scale-105"
        >
          Start Reading
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-1/2 rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle>Chapters</DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center">Loading chapters...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : chapters.length === 0 ? (
            <div className="text-center">No chapters available</div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 rounded-lg shadow-md"
                >
                  <div>
                    <p className="text-lg font-semibold">Chapter {chapter.chapterNumber}</p>
                    <p className="text-sm">{chapter.title}</p>
                    <p className="text-xs">{new Date(chapter.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleReadClick(chapter.id)} // Handle click to navigate
                  >
                    <BookOpen size={18} /> Read
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
