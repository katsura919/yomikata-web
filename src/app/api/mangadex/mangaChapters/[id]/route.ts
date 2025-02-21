import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  uploadDate: string;
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params; // Correct way to access dynamic route params

  if (!id) {
    return NextResponse.json({ error: "Manga ID is required" }, { status: 400 });
  }

  try {
    // Fetching the first 100 chapters using Axios
    const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
      params: {
        limit: 100, 
        translatedLanguage: ["en"], // Fetch only English chapters
      },
    });

    const data = response.data;

    // Extracting relevant chapter details
    const chapters: Chapter[] = data.data.map((chapter: any) => ({
      id: chapter.id,
      title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`,
      chapterNumber: parseFloat(chapter.attributes.chapter) || 0, // Convert to number for sorting
      uploadDate: chapter.attributes.updatedAt,
    }));

    // Sorting chapters in ascending order (1 -> 100)
    chapters.sort((a: Chapter, b: Chapter) => a.chapterNumber - b.chapterNumber);

    // Adding CORS headers
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");

    return new NextResponse(JSON.stringify(chapters), { status: 200, headers });

  } catch (error: any) {
    console.error("Error fetching chapters:", error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}
