import MediaDisplay from "@/components/MediaDisplay"

export default async function HomePage() {
  // TODO Preload songs

  return (
    <div className="flex h-full flex-col items-center justify-center text-3xl">
      <MediaDisplay />
    </div>
  )
}
