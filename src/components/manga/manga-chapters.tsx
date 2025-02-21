"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface Chapter {
  id: string;
  title: string;
  chapterNumber: string;
  uploadDate: string;
}

export default function MangaChapters({ mangaId }: { mangaId: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mangaId) return;

    const controller = new AbortController();

    fetch(`/api/mangadex/mangaChapters/${mangaId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setChapters([]);
        } else {
          setChapters(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching chapters:", err);
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [mangaId]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
                size="lg" 
                className="w-full md:w-auto text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 
                          hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 
                          rounded-2xl shadow-xl transform transition-all hover:scale-105"
              >
              Start Reading
        </Button>
      </DrawerTrigger>
      
      {/* Half-screen drawer with scrollable content */}
      <DrawerContent className="h-1/2 rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle>Chapters</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center">Loading chapters...</div>
          ) : !chapters.length ? (
            <div className="text-center">No chapters available</div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="flex items-center justify-between p-4 rounded-lg shadow-md">
                  <div>
                    <p className="text-lg font-semibold">Chapter {chapter.chapterNumber}</p>
                    <p className="text-sm">{chapter.title}</p>
                    <p className="text-xs">{new Date(chapter.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
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
