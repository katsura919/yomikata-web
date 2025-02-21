import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        console.log("Fetching data from MangaDex...");

        const response = await fetch("https://api.mangadex.org/manga?limit=20&includes[]=cover_art&includes[]=author", {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "yomikata-web (your-email@example.com)"
            }
        });

        if (!response.ok) {
            console.error(`MangaDex API error: ${response.statusText}`);
            return NextResponse.json({ error: response.statusText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching manga:", error);
        return NextResponse.json({ error: "Failed to fetch featured manga" }, { status: 500 });
    }
}
