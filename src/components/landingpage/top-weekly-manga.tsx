"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface Manga {
  id: string;
  title: string;
  coverUrl: string;
  views: number;
}

const TopWeeklyManga: React.FC = () => {
  const [topManga, setTopManga] = useState<Manga[]>([]);

  useEffect(() => {
    const fetchTopManga = async () => {
      try {
        const response = await axios.get("/api/mangadex/topWeekly"); // Calls the new API
        setTopManga(response.data.data);
      } catch (error) {
        console.error("Error fetching weekly top manga:", error);
      }
    };
  
    fetchTopManga();
  }, []);
  
  

  return (
    <div className="w-full">
    
      <div className="space-y-2">
        {topManga.map((manga, index) => (
          <Link
            key={manga.id}
            href={`/manga/${manga.id}`}
            className="flex items-center gap-2 p-2 rounded-lg "
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold">
              {index + 1}
            </div>
            <div className="relative w-12 h-16 rounded-md overflow-hidden">
              <Image
                src={manga.coverUrl}
                alt={manga.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col flex-1">
            <p className="text-sm font-medium truncate">
            {manga.title.length > 30 ? manga.title.slice(0, 50) + "..." : manga.title}
            </p>

              <p className="text-xs opacity-75">👁️ {manga.views.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopWeeklyManga;
