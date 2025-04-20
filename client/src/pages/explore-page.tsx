import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ExplorePage() {
  const { user } = useAuth();
  
  // Sample explore grid data - in a real app, this would come from an API
  const exploreItems = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: `/placeholder-explore-${i + 1}.jpg`,
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          placeholder="Search"
          className="pl-10 bg-gray-100 border-gray-100"
        />
      </div>
      
      {/* Explore grid */}
      <div className="grid grid-cols-3 gap-1">
        {exploreItems.map((item) => (
          <div key={item.id} className="aspect-square relative overflow-hidden">
            <img
              src={item.image}
              alt={`Explore item ${item.id}`}
              className="object-cover w-full h-full hover:opacity-75 transition-opacity cursor-pointer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}