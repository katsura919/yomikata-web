"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
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

const MANGADEX_API = "https://api.mangadex.org";

export default function MangaPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(manga)
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    axios
      .get(`${MANGADEX_API}/manga/${id}`, {
        params: { includes: ["cover_art", "author", "artist"] },
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
      .then(({ data }) => {
        const mangaData = data.data;

        // Extract cover image
        const coverRel = mangaData.relationships.find(
          (rel: any) => rel.type === "cover_art"
        );
        const coverImage = coverRel?.attributes?.fileName
          ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`
          : null;

        // Extract author(s) and artist(s)
        const authors =
          mangaData.relationships
            .filter((rel: any) => rel.type === "author")
            .map((rel: any) => rel.attributes?.name)
            .join(", ") || "Unknown";

        const artists =
          mangaData.relationships
            .filter((rel: any) => rel.type === "artist")
            .map((rel: any) => rel.attributes?.name)
            .join(", ") || "Unknown";

        // Extract description
        const description =
          mangaData.attributes.description?.en || "No description available";

        // Extract alternative titles
        const altTitles: string[] =
          mangaData.attributes.altTitles?.flatMap(
            (titleObj: Record<string, string>) => Object.values(titleObj)
          ) || [];

        // Format response
        const formattedData: Manga = {
          id: mangaData.id,
          title: mangaData.attributes.title?.en || "No Title",
          author: authors,
          artist: artists,
          contentRating: mangaData.attributes.contentRating || "Unknown",
          tags:
            mangaData.attributes.tags?.map(
              (tag: any) => tag.attributes?.name?.en
            ) || [],
          coverImage,
          publication: mangaData.attributes.publicationDemographic || "Unknown",
          description,
          altTitles,
        };

        setManga(formattedData);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching manga:", err);
        }
        setManga(null);
      })
      .finally(() => setLoading(false));

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
