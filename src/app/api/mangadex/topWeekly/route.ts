import { NextResponse } from "next/server";
import axios from "axios";

const allowedOrigins = ["http://localhost:3000", "https://yomikata.vercel.app/"]; // Update with your actual domains

export async function GET(req: Request) {
  const origin = req.headers.get("origin") || "";

  // Check if the request origin is allowed
  if (!allowedOrigins.includes(origin) && origin !== "") {
    return new NextResponse("CORS policy violation", {
      status: 403,
      headers: {
        "Access-Control-Allow-Origin": origin,
      },
    });
  }

  try {
    const response = await axios.get("https://api.mangadex.org/manga", {
      params: {
        limit: 10,
        order: { rating: "desc" }, // Sort by rating/popularity
        includes: ["cover_art"],
      },
    });

    const mangaData = response.data.data.map((manga: any) => {
      const coverArt = manga.relationships.find((rel: any) => rel.type === "cover_art");

      return {
        id: manga.id,
        title: manga.attributes.title.en || "Untitled",
        coverUrl: coverArt
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
          : "https://via.placeholder.com/100",
        views: Math.floor(Math.random() * 50000), // Dummy view count (replace with actual data if available)
      };
    });

    return new NextResponse(JSON.stringify({ data: mangaData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching top weekly manga:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch manga data" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
      },
    });
  }
}

// Handle CORS preflight requests
export function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
