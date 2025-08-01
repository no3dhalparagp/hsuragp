import React from "react"
import Image from "next/image"

export default function GalleryPage() {
  const images = [
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 1" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 2" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 3" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 4" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 5" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 6" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
