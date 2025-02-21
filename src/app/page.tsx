import MangaCarousel from "@/components/landingpage/manga-carousel";
import Footer from "@/components/landingpage/footer";
import RecentlyUpdatedManga from "@/components/landingpage/updated-manga";
import TopWeeklyManga from "@/components/landingpage/top-weekly-manga";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-y-auto scrollbar-custom">
      <div className="mt-32"> {/* Keeps content properly spaced */}
        
        {/* Featured Mangas */}
        <div className="px-4 md:px-10 lg:px-10">
          <h2 className="text-2xl font-bold mb-4 px-4 md:px-10 lg:px-15">🔥 Featured Mangas</h2>
          <MangaCarousel />
        </div>

        {/* Grid Layout: RecentlyUpdatedManga (2/3) | TopWeeklyManga (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 p-2 gap-6 mt-8 md:mx-10 lg:mx-20">
          
          {/* Recently Updated Mangas (Takes 2/3 of the row) */}
          <div className="md:col-span-2 p-4 rounded-lg h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-3">🆕 Recently Updated</h2>
            <RecentlyUpdatedManga />
          </div>

          {/* Top Weekly Mangas (Takes 1/3 of the row) */}
          <div className="p-4 rounded-lg h-full flex flex-col mt-2">
            <h2 className="text-2xl font-bold mb-3">📊 Top Weekly</h2>
            <TopWeeklyManga />
          </div>

        </div>

        <Footer />
      </div>
    </div>
  );
}
