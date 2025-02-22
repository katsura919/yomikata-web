import { NextResponse } from "next/server";
import axios from "axios";

const MANGADEX_API = "https://api.mangadex.org";
const BASE_IMAGE_URL = "https://cmdxd98sb0x3yprd.mangadex.network/data"; // Base URL for images

export async function GET(request: Request, { params }: any) {
  try {
    const { chapterId } = params;
    if (!chapterId) {
      return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });
    }

    // Fetch chapter images
    const { data } = await axios.get(`${MANGADEX_API}/at-home/server/${chapterId}`, {
      headers: { "Content-Type": "application/json", "User-Agent": "Yomikata/0.1.0" },
    });

    console.log("Backend API Response:", data); // Log the response

    // Extract image filenames
    const imageFilenames = data.chapter?.data; // Adjust based on the actual API response structure

    if (!imageFilenames) {
      throw new Error("No images found");
    }

    // Construct full image URLs
    const images = imageFilenames.map((filename: string) => `${BASE_IMAGE_URL}/${data.chapter.hash}/${filename}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching chapter images:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
