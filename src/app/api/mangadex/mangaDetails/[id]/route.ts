import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const MANGADEX_API = "https://api.mangadex.org";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Manga ID is required" }, { status: 400 });
    }

    // Fetch manga details
    const { data } = await axios.get(`${MANGADEX_API}/manga/${id}`, {
      params: { includes: ["cover_art", "author", "artist"] },
      headers: { "Content-Type": "application/json" },
    });

    const manga = data.data;

    // Extract cover image
    const coverRel = manga.relationships.find((rel: any) => rel.type === "cover_art");
    const coverImage = coverRel?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`
      : null;

    // Extract author(s) and artist(s)
    const authors = manga.relationships
      .filter((rel: any) => rel.type === "author")
      .map((rel: any) => rel.attributes?.name)
      .join(", ") || "Unknown";

    const artists = manga.relationships
      .filter((rel: any) => rel.type === "artist")
      .map((rel: any) => rel.attributes?.name)
      .join(", ") || "Unknown";

    // Extract description (fallback to "No description available")
    const description = manga.attributes.description?.en || "No description available";

    // Extract all alt titles (any language)
    const altTitles: string[] = manga.attributes.altTitles?.flatMap((titleObj: Record<string, string>) =>
      Object.values(titleObj)
    ) || [];

    // Format response
    const formattedData = {
      id: manga.id,
      title: manga.attributes.title?.en || "No Title",
      author: authors,
      artist: artists,
      contentRating: manga.attributes.contentRating || "Unknown",
      tags: manga.attributes.tags?.map((tag: any) => tag.attributes?.name?.en) || [],
      coverImage,
      publication: manga.attributes.publicationDemographic || "Unknown",
      description,
      altTitles, // Now includes all alternative titles in multiple languages
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching manga details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
