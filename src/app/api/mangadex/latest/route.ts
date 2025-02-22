// api/mangadex.ts (or your specific API file)
import { NextResponse } from "next/server";
import axios from "axios";
import { middleware } from "@/app/api/cors"; // Adjust the path based on your project structure

export async function GET(request: Request) {
  const response = middleware(request); // Call CORS middleware

  try {
    const mangaResponse = await axios.get("https://api.mangadex.org/manga", {
      params: {
        limit: 18,
        order: { updatedAt: "desc" },
        includes: ["cover_art", "author"],
      },
    });

    const mangaData = mangaResponse.data.data.map((manga: any) => {
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

    return NextResponse.json(mangaData, { status: 200 });
  } catch (error) {
    console.error("Error fetching manga:", error);
    return NextResponse.json(
      { error: "Failed to fetch manga data" },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
