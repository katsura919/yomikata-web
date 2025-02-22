import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const MANGADEX_API = "https://api.mangadex.org";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Manga ID is required" }, { status: 400 });
    }

    // Fetch manga chapters
    const { data } = await axios.get(`${MANGADEX_API}/manga/${id}/feed`, {
      params: {
        limit: 100, // Adjust as needed
        translatedLanguage: ['en'],
      },
      headers: {
        "Content-Type": "application/json",
        'User-Agent': 'Yomikata/0.1.0',
      },
    });

    if (!data || !data.data) {
      return NextResponse.json({ error: "No chapters found" }, { status: 404 });
    }

    const formattedChapters = data.data.map((chapter: any) => ({
      id: chapter.id,
      title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || 'Unknown'}`,
      chapterNumber: chapter.attributes.chapter || '0',
      uploadDate: chapter.attributes.updatedAt,
    }));

    // Set CORS headers
    const response = NextResponse.json(formattedChapters);
    response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (adjust as needed)
    response.headers.set('Access-Control-Allow-Methods', 'GET'); // Allow GET method
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

    return response;
  } catch (error) {
    console.error("Error fetching manga chapters:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
