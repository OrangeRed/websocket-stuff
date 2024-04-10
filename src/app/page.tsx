import MediaDisplay from "@/components/MediaDisplay"
import MediaSearch from "@/components/MediaSearch"

export default async function HomePage() {

  return (
    <>
      <div className="flex h-full items-center justify-center text-3xl">
        <MediaDisplay />
      </div>

      <MediaSearch />
    </>
  )
}
