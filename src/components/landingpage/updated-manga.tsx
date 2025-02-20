"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Manga {
  id: string;
  title: string;
  coverUrl: string;
  authors: string;
}

const RecentlyUpdatedManga: React.FC = () => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get("https://api.mangadex.org/manga", {
          params: {
            limit: 18,
            order: { updatedAt: "desc" },
            includes: ["cover_art", "author"],
          },
        });

        const mangaData = response.data.data.map((manga: any): Manga => {
          const coverArt = manga.relationships.find(
            (rel: any) => rel.type === "cover_art"
          );
          const author = manga.relationships.find(
            (rel: any) => rel.type === "author"
          );

          return {
            id: manga.id,
            title: manga.attributes.title.en || "Untitled",
            coverUrl: coverArt
              ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
              : "https://via.placeholder.com/150",
            authors: author?.attributes?.name || "Unknown",
          };
        });

        setMangaList(mangaData);
      } catch (error) {
        console.error("Error fetching manga:", error);
      }
    };

    fetchManga();
  }, []);

  return (
    <div className="w-full">
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full">
      {mangaList.map((manga) => (
        <Card
          key={manga.id}
          className="relative h-[250px] sm:h-[250px] md:h-[270px] lg:h-[300px] w-full overflow-hidden rounded-md group"
        >
          <Link href={`/manga/${manga.id}`} className="block w-full h-full">
            <Image
              src={manga.coverUrl}
              alt={manga.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full p-3 text-white transition-transform duration-500 group-hover:translate-y-[-5px]">
              <h3 className="text-sm font-bold truncate">{manga.title}</h3>
              <p className="text-xs opacity-75 truncate">{manga.authors}</p>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  </div>
  );
};

export default RecentlyUpdatedManga;
