"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react"; // Import use from React

const ReadingPage = ({ params }: { params: Promise<{ chapterId: string }> }) => {
  const { chapterId } = use(params);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(images);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(`/api/mangadex/chapterImages/${chapterId}`);

        // Check if data.images exists and is an array
        if (data.images && Array.isArray(data.images)) {
          console.log("Fetched Image URLs:", data.images); // Log fetched URLs
          setImages(data.images); // Directly set the images from the response
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching chapter images:", err);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [chapterId]);

  return (
    <div className="flex flex-col items-center overflow-y-auto h-screen"> {/* Add scroll and height */}
      {loading ? (
        <div>Loading images...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : images.length === 0 ? (
        <div>No images available for this chapter.</div>
      ) : (
        images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Chapter ${chapterId} - Page ${index + 1}`}
            className="my-4 max-w-full" // Optional: Limit image width
            onError={() => console.error(`Image failed to load: ${image}`)} // Log error if image fails to load
          />
        ))
      )}
    </div>
  );
};

export default ReadingPage;
