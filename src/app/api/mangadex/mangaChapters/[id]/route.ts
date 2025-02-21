import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  uploadDate: string;
}

interface MangaDexChapterResponse {
  data: {
    id: string;
    attributes: {
      title: string | null;
      chapter: string | null;
      updatedAt: string;
    };
  }[];
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Manga ID is required" }, { status: 400 });
  }

  try {
    let allChapters: Chapter[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
        params: {
          limit,
          offset,
          translatedLanguage: ["en"],
        },
      });

      const data = response.data as MangaDexChapterResponse;

      const chapters: Chapter[] = data.data.map((chapter) => ({
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

    // Sort all chapters
    allChapters.sort((a: Chapter, b: Chapter) => a.chapterNumber - b.chapterNumber);

    return NextResponse.json(allChapters, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching chapters:", error);

    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}