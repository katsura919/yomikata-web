// app/api/mangadex/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const MANGADEX_API = "https://api.mangadex.org";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const response = await axios.get(`${MANGADEX_API}/manga/${id}`, {
      params: {
        includes: ["cover_art", "author", "artist"],
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const mangaData = response.data.data;

    // Extract cover image
    const coverRel = mangaData.relationships.find((rel: any) => rel.type === "cover_art");
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
    const formattedData = {
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

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching manga:", error);
    return NextResponse.json({ error: 'Failed to fetch manga data' }, { status: 500 });
  }
}
