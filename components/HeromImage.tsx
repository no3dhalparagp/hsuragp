import { Suspense } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { allheroImage } from "@/action/heroimage";
import { Button } from "@/components/ui/button";

interface HeroImage {
  id: string;
  imageUrl: string;
  imageKey: string;
  heroImageDescription: string;
}

const ImageGrid = async () => {
  const heroImages: HeroImage[] | undefined = await allheroImage();

  if (!heroImages || heroImages.length === 0) {
    return <div className="text-center py-10">No images to display</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {heroImages.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

const ImageCard: React.FC<{ image: HeroImage }> = ({ image }) => (
  <div className="border rounded-lg overflow-hidden shadow-md">
    <div className="relative aspect-video">
      <Image
  src={image.imageUrl || "/placeholder.svg"}
  alt={image.heroImageDescription}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
/>
    </div>
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-2">{image.heroImageDescription}</p>
    </div>
  </div>
);

const LoadingPlaceholder: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="border rounded-lg overflow-hidden shadow-md animate-pulse"
      >
        <div className="bg-gray-300 aspect-video" />
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-8 bg-gray-300 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const HeromImage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <ImageGrid />
    </Suspense>
  );
};

export default HeromImage;
