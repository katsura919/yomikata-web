import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get("https://api.mangadex.org/manga", {
      params: {
        title,
        limit: 18,
        order: { updatedAt: "desc" },
        includes: ["cover_art", "author"],
      },
    });

    const mangaData = response.data.data.map((manga: any) => {
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

    return NextResponse.json(mangaData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
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
