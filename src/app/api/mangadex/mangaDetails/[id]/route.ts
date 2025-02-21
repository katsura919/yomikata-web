import { NextResponse } from 'next/server';

const MANGADEX_API = 'https://api.mangadex.org';

export async function GET(
  request: Request,
  { params }: { params: { id: string } } // Change 'manga' to 'id' to match your route
) {
  const mangaId = params.id; // Get the manga ID from params

  try {
    const response = await fetch(`${MANGADEX_API}/manga/${mangaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      return NextResponse.json({ error: 'Manga not found' }, { status: 404 });
    }

    const data = await response.json();
    const mangaData = data.data;

    // Extract cover image
    const coverRel = mangaData.relationships.find(
      (rel: any) => rel.type === 'cover_art'
    );
    const coverImage = coverRel?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${mangaId}/${coverRel.attributes.fileName}`
      : null;

    // Extract author(s) and artist(s)
    const authors =
      mangaData.relationships
        .filter((rel: any) => rel.type === 'author')
        .map((rel: any) => rel.attributes?.name)
        .join(', ') || 'Unknown';

    const artists =
      mangaData.relationships
        .filter((rel: any) => rel.type === 'artist')
        .map((rel: any) => rel.attributes?.name)
        .join(', ') || 'Unknown';

    // Extract description
    const description =
      mangaData.attributes.description?.en || 'No description available';

    // Extract alternative titles
    const altTitles: string[] =
      mangaData.attributes.altTitles?.flatMap(
        (titleObj: Record<string, string>) => Object.values(titleObj)
      ) || [];

    // Format response
    const formattedData = {
      id: mangaData.id,
      title: mangaData.attributes.title?.en || 'No Title',
      author: authors,
      artist: artists,
      contentRating: mangaData.attributes.contentRating || 'Unknown',
      tags:
        mangaData.attributes.tags?.map(
          (tag: any) => tag.attributes?.name?.en
        ) || [],
      coverImage,
      publication: mangaData.attributes.publicationDemographic || 'Unknown',
      description,
      altTitles,
    };

    return NextResponse.json(formattedData); // Return the formatted manga data as JSON
  } catch (error) {
    console.error('Error fetching manga:', error);
    return NextResponse.json({ error: 'An error occurred while fetching manga details' }, { status: 500 });
  }
}
