import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const MANGADEX_API = "https://api.mangadex.org";

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  uploadDate: string;
} 

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Manga ID is required" }, { status: 400 });
    }

    let allChapters: Chapter[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const { data } = await axios.get(`${MANGADEX_API}/manga/${id}/feed`, {
        params: {
          limit,
          offset,
          translatedLanguage: ["en"],
        },
      });

      const chapters: Chapter[] = data.data.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || "Unknown"}`,
        chapterNumber: chapter.attributes.chapter ? parseFloat(chapter.attributes.chapter) : 0, // Handle null case
        uploadDate: chapter.attributes.updatedAt,
      }));

      allChapters = allChapters.concat(chapters);

      if (data.data.length < limit) {
        break; // Exit the loop if we've fetched all chapters
      }

      offset += limit;
    }

    // Sort chapters in ascending order
    allChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    return NextResponse.json(allChapters);
  } catch (error) {
    console.error("Error fetching manga chapters:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}